import FeeChallan from '#models/fee_challan'
import Student from '#models/student'
import ChallanStatus from '#enums/challan_status'
import { DateTime } from 'luxon'

type Params = {
  schoolId: string
  academicYearId?: string
  classId?: string
  minOverdueMonths?: number // minimum number of overdue months to be considered defaulter
}

type DefaulterInfo = {
  student: Student
  className: string
  sectionName: string | null
  totalDue: number
  overdueMonths: number
  lastPaymentDate: DateTime | null
  challans: FeeChallan[]
}

export default class DefaultersReport {
  static async handle({ schoolId, academicYearId, classId, minOverdueMonths = 2 }: Params) {
    // Get all overdue challans
    const challanQuery = FeeChallan.query()
      .where('schoolId', schoolId)
      .whereIn('status', [ChallanStatus.PENDING, ChallanStatus.PARTIAL, ChallanStatus.OVERDUE])
      .where('balanceAmount', '>', 0)
      .where('dueDate', '<', DateTime.now().toSQL())
      .preload('student')
      .preload('enrollment', (q) => q.preload('class').preload('section'))
      .preload('payments', (q) => q.where('isCancelled', false).orderBy('paymentDate', 'desc'))
      .orderBy('studentId')
      .orderBy('dueDate')

    if (academicYearId) {
      challanQuery.where('academicYearId', academicYearId)
    }

    if (classId) {
      challanQuery.whereHas('enrollment', (q) => q.where('classId', classId))
    }

    const challans = await challanQuery

    // Group by student
    const studentMap = new Map<string, DefaulterInfo>()

    for (const challan of challans) {
      const studentId = challan.studentId

      if (!studentMap.has(studentId)) {
        const lastPayment = challan.payments?.[0]
        studentMap.set(studentId, {
          student: challan.student,
          className: challan.enrollment?.class?.name ?? 'Unknown',
          sectionName: challan.enrollment?.section?.name ?? null,
          totalDue: 0,
          overdueMonths: 0,
          lastPaymentDate: lastPayment?.paymentDate ?? null,
          challans: [],
        })
      }

      const info = studentMap.get(studentId)!
      info.totalDue += Number(challan.balanceAmount)
      info.overdueMonths++
      info.challans.push(challan)

      // Update last payment date if this challan has a more recent payment
      const lastPayment = challan.payments?.[0]
      if (
        lastPayment &&
        (!info.lastPaymentDate || lastPayment.paymentDate > info.lastPaymentDate)
      ) {
        info.lastPaymentDate = lastPayment.paymentDate
      }
    }

    // Filter by minimum overdue months
    const defaulters = Array.from(studentMap.values())
      .filter((d) => d.overdueMonths >= minOverdueMonths)
      .sort((a, b) => b.overdueMonths - a.overdueMonths || b.totalDue - a.totalDue)

    // Calculate summary
    const totalDefaulters = defaulters.length
    const totalOutstanding = defaulters.reduce((sum, d) => sum + d.totalDue, 0)
    const avgOverdueMonths =
      defaulters.length > 0
        ? defaulters.reduce((sum, d) => sum + d.overdueMonths, 0) / defaulters.length
        : 0

    // Group by class
    const byClass: Record<string, { count: number; amount: number }> = {}
    for (const defaulter of defaulters) {
      if (!byClass[defaulter.className]) {
        byClass[defaulter.className] = { count: 0, amount: 0 }
      }
      byClass[defaulter.className].count++
      byClass[defaulter.className].amount += defaulter.totalDue
    }

    return {
      defaulters,
      summary: {
        totalDefaulters,
        totalOutstanding,
        avgOverdueMonths: Math.round(avgOverdueMonths * 10) / 10,
        byClass,
      },
    }
  }
}

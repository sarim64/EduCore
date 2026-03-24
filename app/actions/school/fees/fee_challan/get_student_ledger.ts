import FeeChallan from '#models/fee_challan'
import FeePayment from '#models/fee_payment'
import Student from '#models/student'
import { Exception } from '@adonisjs/core/exceptions'

type Params = {
  studentId: string
  schoolId: string
  academicYearId?: string
}

export default class GetStudentLedger {
  static async handle({ studentId, schoolId, academicYearId }: Params) {
    // Verify student belongs to school
    const student = await Student.query()
      .where('id', studentId)
      .where('schoolId', schoolId)
      .preload('enrollments', (q) =>
        q.preload('academicYear').preload('class').preload('section').orderBy('createdAt', 'desc')
      )
      .first()

    if (!student) {
      throw new Exception('Student not found', { status: 404 })
    }

    // Get all challans for this student
    const challanQuery = FeeChallan.query()
      .where('studentId', studentId)
      .where('schoolId', schoolId)
      .preload('academicYear')
      .preload('items', (q) => q.preload('feeCategory'))
      .orderBy('issueDate', 'desc')

    if (academicYearId) {
      challanQuery.where('academicYearId', academicYearId)
    }

    const challans = await challanQuery

    // Get all payments for this student
    const paymentQuery = FeePayment.query()
      .where('studentId', studentId)
      .where('schoolId', schoolId)
      .where('isCancelled', false)
      .preload('feeChallan')
      .orderBy('paymentDate', 'desc')

    if (academicYearId) {
      paymentQuery.whereHas('feeChallan', (q) => q.where('academicYearId', academicYearId))
    }

    const payments = await paymentQuery

    // Calculate summary
    const totalFees = challans.reduce((sum, c) => sum + Number(c.totalAmount), 0)
    const totalDiscounts = challans.reduce((sum, c) => sum + Number(c.discountAmount), 0)
    const totalLateFees = challans.reduce((sum, c) => sum + Number(c.lateFeeAmount), 0)
    const totalPayable = challans.reduce((sum, c) => sum + Number(c.netAmount), 0)
    const totalPaid = payments.reduce((sum, p) => sum + Number(p.amount), 0)
    const totalBalance = totalPayable - totalPaid

    // Get overdue months count for defaulter check
    const overdueChallans = challans.filter((c) => c.isOverdue && c.balanceAmount > 0)
    const overdueMonths = overdueChallans.length

    return {
      student,
      challans,
      payments,
      summary: {
        totalFees,
        totalDiscounts,
        totalLateFees,
        totalPayable,
        totalPaid,
        totalBalance,
        overdueMonths,
        isDefaulter: overdueMonths >= 2, // 2+ months overdue = defaulter
      },
    }
  }
}

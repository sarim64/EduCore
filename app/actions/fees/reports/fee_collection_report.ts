import FeePayment from '#models/fee_payment'
import FeeChallan from '#models/fee_challan'
import PaymentMethod from '#enums/payment_method'
import { DateTime } from 'luxon'

type Params = {
  schoolId: string
  academicYearId?: string
  classId?: string
  startDate?: DateTime
  endDate?: DateTime
  groupBy?: 'day' | 'week' | 'month' | 'class' | 'paymentMethod'
}

export default class FeeCollectionReport {
  static async handle({
    schoolId,
    academicYearId,
    classId,
    startDate,
    endDate,
    groupBy = 'day',
  }: Params) {
    // Get payments within date range
    const paymentQuery = FeePayment.query()
      .where('schoolId', schoolId)
      .where('isCancelled', false)
      .preload('student')
      .preload('feeChallan', (q) => q.preload('enrollment', (eq) => eq.preload('class')))

    if (startDate) {
      paymentQuery.where('paymentDate', '>=', startDate.toSQL()!)
    }

    if (endDate) {
      paymentQuery.where('paymentDate', '<=', endDate.toSQL()!)
    }

    if (academicYearId) {
      paymentQuery.whereHas('feeChallan', (q) => q.where('academicYearId', academicYearId))
    }

    if (classId) {
      paymentQuery.whereHas('feeChallan', (q) =>
        q.whereHas('enrollment', (eq) => eq.where('classId', classId))
      )
    }

    const payments = await paymentQuery.orderBy('paymentDate', 'desc')

    // Calculate totals
    const totalCollected = payments.reduce((sum, p) => sum + Number(p.amount), 0)
    const totalTransactions = payments.length

    // Group by payment method
    const byPaymentMethod: Record<string, { count: number; amount: number }> = {}
    for (const method of Object.values(PaymentMethod)) {
      byPaymentMethod[method] = { count: 0, amount: 0 }
    }
    for (const payment of payments) {
      byPaymentMethod[payment.paymentMethod].count++
      byPaymentMethod[payment.paymentMethod].amount += Number(payment.amount)
    }

    // Group by date/class based on groupBy parameter
    let groupedData: Array<{ label: string; count: number; amount: number }> = []

    if (groupBy === 'day') {
      const byDate: Record<string, { count: number; amount: number }> = {}
      for (const payment of payments) {
        const date = payment.paymentDate.toISODate()!
        if (!byDate[date]) {
          byDate[date] = { count: 0, amount: 0 }
        }
        byDate[date].count++
        byDate[date].amount += Number(payment.amount)
      }
      groupedData = Object.entries(byDate)
        .map(([label, data]) => ({ label, ...data }))
        .sort((a, b) => a.label.localeCompare(b.label))
    } else if (groupBy === 'month') {
      const byMonth: Record<string, { count: number; amount: number }> = {}
      for (const payment of payments) {
        const month = payment.paymentDate.toFormat('yyyy-MM')
        if (!byMonth[month]) {
          byMonth[month] = { count: 0, amount: 0 }
        }
        byMonth[month].count++
        byMonth[month].amount += Number(payment.amount)
      }
      groupedData = Object.entries(byMonth)
        .map(([label, data]) => ({ label, ...data }))
        .sort((a, b) => a.label.localeCompare(b.label))
    } else if (groupBy === 'class') {
      const byClass: Record<string, { count: number; amount: number }> = {}
      for (const payment of payments) {
        const className = payment.feeChallan?.enrollment?.class?.name ?? 'Unknown'
        if (!byClass[className]) {
          byClass[className] = { count: 0, amount: 0 }
        }
        byClass[className].count++
        byClass[className].amount += Number(payment.amount)
      }
      groupedData = Object.entries(byClass).map(([label, data]) => ({ label, ...data }))
    } else if (groupBy === 'paymentMethod') {
      groupedData = Object.entries(byPaymentMethod).map(([label, data]) => ({ label, ...data }))
    }

    // Get outstanding amount
    const outstandingQuery = FeeChallan.query()
      .where('schoolId', schoolId)
      .whereIn('status', ['pending', 'partial', 'overdue'])

    if (academicYearId) {
      outstandingQuery.where('academicYearId', academicYearId)
    }

    const outstandingChallans = await outstandingQuery
    const totalOutstanding = outstandingChallans.reduce(
      (sum, c) => sum + Number(c.balanceAmount),
      0
    )

    return {
      payments,
      summary: {
        totalCollected,
        totalTransactions,
        totalOutstanding,
        byPaymentMethod,
      },
      groupedData,
    }
  }
}

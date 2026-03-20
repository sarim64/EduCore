import FeePayment from '#models/fee_payment'
import { DateTime } from 'luxon'

type Params = {
  schoolId: string
  studentId?: string
  challanId?: string
  startDate?: DateTime
  endDate?: DateTime
  page?: number
  limit?: number
}

export default class ListPayments {
  static async handle({
    schoolId,
    studentId,
    challanId,
    startDate,
    endDate,
    page = 1,
    limit = 20,
  }: Params) {
    const query = FeePayment.query()
      .where('schoolId', schoolId)
      .where('isCancelled', false)
      .preload('student')
      .preload('feeChallan')
      .orderBy('paymentDate', 'desc')

    if (studentId) {
      query.where('studentId', studentId)
    }

    if (challanId) {
      query.where('feeChallanId', challanId)
    }

    if (startDate) {
      query.where('paymentDate', '>=', startDate.toSQL()!)
    }

    if (endDate) {
      query.where('paymentDate', '<=', endDate.toSQL()!)
    }

    return query.paginate(page, limit)
  }
}

import FeePaymentDto from '#dtos/fee_payment'
import FeeChallanDto from '#dtos/fee_challan'
import ListPayments from '#actions/school/fees/fee_payment/list_payments'
import RecordPayment from '#actions/school/fees/fee_payment/record_payment'
import CancelPayment from '#actions/school/fees/fee_payment/cancel_payment'
import GetChallan from '#actions/school/fees/fee_challan/get_challan'
import { DateTime } from 'luxon'
import { recordPaymentValidator, cancelPaymentValidator } from '#validators/fee_payment'
import type { HttpContext } from '@adonisjs/core/http'

export default class FeePaymentsController {
  async index({ session, request, inertia }: HttpContext) {
    const schoolId = session.get('schoolId')
    const page = request.input('page', 1)
    const studentId = request.input('studentId')
    const startDate = request.input('startDate')
    const endDate = request.input('endDate')

    const payments = await ListPayments.handle({
      schoolId,
      studentId,
      startDate: startDate ? DateTime.fromISO(startDate) : undefined,
      endDate: endDate ? DateTime.fromISO(endDate) : undefined,
      page,
    })

    return inertia.render('school/fees/payments/index', {
      payments: {
        data: payments.all().map((p) => new FeePaymentDto(p)),
        meta: payments.getMeta(),
      },
      filters: { studentId, startDate, endDate },
    })
  }

  async create({ params, session, inertia }: HttpContext) {
    const schoolId = session.get('schoolId')
    const challanId = params.challanId

    const challan = await GetChallan.handle({ id: challanId, schoolId })

    return inertia.render('school/fees/payments/create', {
      challan: new FeeChallanDto(challan),
    })
  }

  async store(ctx: HttpContext) {
    const { request, response, session, auth } = ctx
    const schoolId = session.get('schoolId')
    const userId = auth.user!.id
    const data = await request.validateUsing(recordPaymentValidator)

    try {
      await RecordPayment.handle({ schoolId, userId, data, ctx })
      session.flash('success', 'Payment recorded successfully')
    } catch (error) {
      session.flash('error', error.message)
      return response.redirect().back()
    }

    return response.redirect().toRoute('fees.challans.show', { id: data.feeChallanId })
  }

  async cancel({ params, request, response, session, auth }: HttpContext) {
    const schoolId = session.get('schoolId')
    const userId = auth.user!.id
    const data = await request.validateUsing(cancelPaymentValidator)

    try {
      await CancelPayment.handle({ id: params.id, schoolId, userId, data })
      session.flash('success', 'Payment cancelled successfully')
    } catch (error) {
      session.flash('error', error.message)
    }

    return response.redirect().back()
  }
}

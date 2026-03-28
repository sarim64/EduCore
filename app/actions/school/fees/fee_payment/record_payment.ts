import FeePayment from '#models/fee_payment'
import FeeChallan from '#models/fee_challan'
import ChallanStatus from '#enums/challan_status'
import PaymentMethod from '#enums/payment_method'
import { recordPaymentValidator } from '#validators/fee_payment'
import { Infer } from '@vinejs/vine/types'
import { DateTime } from 'luxon'
import db from '@adonisjs/lucid/services/db'
import { Exception } from '@adonisjs/core/exceptions'
import AuditService from '#services/audit_service'
import type { HttpContext } from '@adonisjs/core/http'

type Params = {
  schoolId: string
  userId: string
  data: Infer<typeof recordPaymentValidator>
  ctx: HttpContext
}

export default class RecordPayment {
  static async handle({ schoolId, userId, data, ctx }: Params) {
    const payment = await db.transaction(async (trx) => {
      // Get the challan
      const challan = await FeeChallan.query({ client: trx })
        .where('id', data.feeChallanId)
        .where('schoolId', schoolId)
        .preload('student')
        .first()

      if (!challan) {
        throw new Exception('Fee challan not found', { status: 404 })
      }

      if (challan.status === ChallanStatus.CANCELLED) {
        throw new Exception('Cannot record payment for cancelled challan', { status: 400 })
      }

      if (challan.status === ChallanStatus.PAID) {
        throw new Exception('Challan is already fully paid', { status: 400 })
      }

      if (data.amount > challan.balanceAmount) {
        throw new Exception(
          `Payment amount exceeds balance. Maximum payable: ${challan.balanceAmount}`,
          { status: 400 }
        )
      }

      // Generate receipt number
      const receiptNumber = await this.#generateReceiptNumber(schoolId, trx)

      // Convert dates
      const paymentDateTime = DateTime.fromJSDate(data.paymentDate)
      const chequeDateDateTime = data.chequeDate ? DateTime.fromJSDate(data.chequeDate) : null

      // Create payment record
      const newPayment = await FeePayment.create(
        {
          schoolId,
          feeChallanId: data.feeChallanId,
          studentId: challan.studentId,
          receiptNumber,
          amount: data.amount,
          paymentMethod: data.paymentMethod as PaymentMethod,
          paymentDate: paymentDateTime,
          chequeNumber: data.chequeNumber,
          chequeDate: chequeDateDateTime,
          bankName: data.bankName,
          transactionReference: data.transactionReference,
          remarks: data.remarks,
          receivedBy: userId,
          isCancelled: false,
        },
        { client: trx }
      )

      // Update challan
      challan.paidAmount = Number(challan.paidAmount) + data.amount
      challan.balanceAmount = challan.netAmount - challan.paidAmount

      if (challan.balanceAmount <= 0) {
        challan.status = ChallanStatus.PAID
      } else {
        challan.status = ChallanStatus.PARTIAL
      }

      await challan.save()

      return newPayment
    })

    await AuditService.log(
      {
        schoolId,
        userId,
        action: 'payment',
        entityType: 'FeePayment',
        entityId: payment.id,
        newValues: { receiptNumber: payment.receiptNumber, amount: payment.amount, paymentMethod: payment.paymentMethod, feeChallanId: payment.feeChallanId },
        description: 'Fee payment recorded',
      },
      ctx
    )

    return payment
  }

  static async #generateReceiptNumber(
    schoolId: string,
    trx: ReturnType<typeof db.transaction> extends Promise<infer T> ? T : never
  ) {
    const now = DateTime.now()
    const prefix = `RCP-${now.year}${String(now.month).padStart(2, '0')}`

    const lastPayment = await FeePayment.query({ client: trx })
      .where('schoolId', schoolId)
      .where('receiptNumber', 'like', `${prefix}%`)
      .orderBy('receiptNumber', 'desc')
      .first()

    let sequence = 1
    if (lastPayment) {
      const lastSequence = Number.parseInt(lastPayment.receiptNumber.split('-').pop() || '0', 10)
      sequence = lastSequence + 1
    }

    return `${prefix}-${String(sequence).padStart(5, '0')}`
  }
}

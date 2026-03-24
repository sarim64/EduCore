import FeePayment from '#models/fee_payment'
import FeeChallan from '#models/fee_challan'
import ChallanStatus from '#enums/challan_status'
import { cancelPaymentValidator } from '#validators/fee_payment'
import { Infer } from '@vinejs/vine/types'
import { DateTime } from 'luxon'
import db from '@adonisjs/lucid/services/db'
import { Exception } from '@adonisjs/core/exceptions'

type Params = {
  id: string
  schoolId: string
  userId: string
  data: Infer<typeof cancelPaymentValidator>
}

export default class CancelPayment {
  static async handle({ id, schoolId, userId, data }: Params) {
    return db.transaction(async (trx) => {
      const payment = await FeePayment.query({ client: trx })
        .where('id', id)
        .where('schoolId', schoolId)
        .first()

      if (!payment) {
        throw new Exception('Payment not found', { status: 404 })
      }

      if (payment.isCancelled) {
        throw new Exception('Payment is already cancelled', { status: 400 })
      }

      // Cancel the payment
      payment.isCancelled = true
      payment.cancellationReason = data.reason
      payment.cancelledBy = userId
      payment.cancelledAt = DateTime.now()
      await payment.save()

      // Update the challan
      const challan = await FeeChallan.query({ client: trx })
        .where('id', payment.feeChallanId)
        .first()

      if (challan) {
        challan.paidAmount = Number(challan.paidAmount) - Number(payment.amount)
        challan.balanceAmount = challan.netAmount - challan.paidAmount

        if (challan.paidAmount <= 0) {
          challan.status =
            challan.dueDate < DateTime.now() ? ChallanStatus.OVERDUE : ChallanStatus.PENDING
        } else {
          challan.status = ChallanStatus.PARTIAL
        }

        await challan.save()
      }

      // TODO: Create reversing journal entry if needed

      return payment
    })
  }
}

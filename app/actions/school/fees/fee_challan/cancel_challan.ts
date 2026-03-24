import FeeChallan from '#models/fee_challan'
import ChallanStatus from '#enums/challan_status'
import { Exception } from '@adonisjs/core/exceptions'

type Params = {
  id: string
  schoolId: string
}

export default class CancelChallan {
  static async handle({ id, schoolId }: Params) {
    const challan = await FeeChallan.query().where('id', id).where('schoolId', schoolId).first()

    if (!challan) {
      throw new Exception('Fee challan not found', { status: 404 })
    }

    if (challan.paidAmount > 0) {
      throw new Exception('Cannot cancel challan with payments. Cancel payments first.', {
        status: 400,
      })
    }

    challan.status = ChallanStatus.CANCELLED
    await challan.save()

    return challan
  }
}

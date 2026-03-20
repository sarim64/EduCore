import FeeDiscount from '#models/fee_discount'
import { Exception } from '@adonisjs/core/exceptions'

type Params = {
  id: string
  schoolId: string
}

export default class GetFeeDiscount {
  static async handle({ id, schoolId }: Params) {
    const discount = await FeeDiscount.query()
      .where('id', id)
      .where('schoolId', schoolId)
      .preload('feeCategory')
      .first()

    if (!discount) {
      throw new Exception('Fee discount not found', { status: 404 })
    }

    return discount
  }
}

import DiscountType from '#enums/discount_type'
import FeeDiscount from '#models/fee_discount'
import { updateFeeDiscountValidator } from '#validators/fee_discount'
import { Infer } from '@vinejs/vine/types'
import { Exception } from '@adonisjs/core/exceptions'
import { DateTime } from 'luxon'

type Params = {
  id: string
  schoolId: string
  data: Infer<typeof updateFeeDiscountValidator>
}

export default class UpdateFeeDiscount {
  static async handle({ id, schoolId, data }: Params) {
    const discount = await FeeDiscount.query().where('id', id).where('schoolId', schoolId).first()

    if (!discount) {
      throw new Exception('Fee discount not found', { status: 404 })
    }

    discount.merge({
      ...data,
      discountType: data.discountType ? (data.discountType as DiscountType) : undefined,
      validFrom: data.validFrom ? DateTime.fromJSDate(data.validFrom) : undefined,
      validUntil: data.validUntil ? DateTime.fromJSDate(data.validUntil) : undefined,
    })
    await discount.save()

    return discount
  }
}

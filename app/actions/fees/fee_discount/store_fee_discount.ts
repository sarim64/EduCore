import DiscountType from '#enums/discount_type'
import FeeDiscount from '#models/fee_discount'
import { createFeeDiscountValidator } from '#validators/fee_discount'
import { Infer } from '@vinejs/vine/types'
import { DateTime } from 'luxon'

type Params = {
  schoolId: string
  data: Infer<typeof createFeeDiscountValidator>
}

export default class StoreFeeDiscount {
  static async handle({ schoolId, data }: Params) {
    return FeeDiscount.create({
      ...data,
      discountType: data.discountType as DiscountType,
      validFrom: data.validFrom ? DateTime.fromJSDate(data.validFrom) : null,
      validUntil: data.validUntil ? DateTime.fromJSDate(data.validUntil) : null,
      schoolId,
    })
  }
}

import FeeDiscount from '#models/fee_discount'

type Params = {
  schoolId: string
  includeInactive?: boolean
}

export default class ListFeeDiscounts {
  static async handle({ schoolId, includeInactive = false }: Params) {
    const query = FeeDiscount.query()
      .where('schoolId', schoolId)
      .preload('feeCategory')
      .orderBy('name')

    if (!includeInactive) {
      query.where('isActive', true)
    }

    return query
  }
}

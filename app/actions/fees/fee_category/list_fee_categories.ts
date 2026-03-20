import FeeCategory from '#models/fee_category'

type Params = {
  schoolId: string
  includeInactive?: boolean
}

export default class ListFeeCategories {
  static async handle({ schoolId, includeInactive = false }: Params) {
    const query = FeeCategory.query()
      .where('schoolId', schoolId)
      .orderBy('displayOrder')
      .orderBy('name')

    if (!includeInactive) {
      query.where('isActive', true)
    }

    return query
  }
}

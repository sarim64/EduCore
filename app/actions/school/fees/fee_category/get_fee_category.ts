import FeeCategory from '#models/fee_category'
import { Exception } from '@adonisjs/core/exceptions'

type Params = {
  id: string
  schoolId: string
}

export default class GetFeeCategory {
  static async handle({ id, schoolId }: Params) {
    const category = await FeeCategory.query()
      .where('id', id)
      .where('schoolId', schoolId)
      .first()

    if (!category) {
      throw new Exception('Fee category not found', { status: 404 })
    }

    return category
  }
}

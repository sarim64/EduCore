import FeeCategory from '#models/fee_category'
import { updateFeeCategoryValidator } from '#validators/fee_category'
import { Infer } from '@vinejs/vine/types'
import { Exception } from '@adonisjs/core/exceptions'

type Params = {
  id: string
  schoolId: string
  data: Infer<typeof updateFeeCategoryValidator>
}

export default class UpdateFeeCategory {
  static async handle({ id, schoolId, data }: Params) {
    const category = await FeeCategory.query().where('id', id).where('schoolId', schoolId).first()

    if (!category) {
      throw new Exception('Fee category not found', { status: 404 })
    }

    category.merge(data)
    await category.save()

    return category
  }
}

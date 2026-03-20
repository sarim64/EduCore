import FeeCategory from '#models/fee_category'
import FeeStructure from '#models/fee_structure'
import { Exception } from '@adonisjs/core/exceptions'

type Params = {
  id: string
  schoolId: string
}

export default class DeleteFeeCategory {
  static async handle({ id, schoolId }: Params) {
    const category = await FeeCategory.query().where('id', id).where('schoolId', schoolId).first()

    if (!category) {
      throw new Exception('Fee category not found', { status: 404 })
    }

    // Check if category is used in fee structures
    const hasStructures = await FeeStructure.query().where('feeCategoryId', id).first()

    if (hasStructures) {
      throw new Exception('Cannot delete fee category that has associated fee structures', {
        status: 400,
      })
    }

    await category.delete()
  }
}

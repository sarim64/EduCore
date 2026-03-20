import FeeStructure from '#models/fee_structure'
import { Exception } from '@adonisjs/core/exceptions'

type Params = {
  id: string
  schoolId: string
}

export default class GetFeeStructure {
  static async handle({ id, schoolId }: Params) {
    const structure = await FeeStructure.query()
      .where('id', id)
      .where('schoolId', schoolId)
      .preload('academicYear')
      .preload('class')
      .preload('feeCategory')
      .first()

    if (!structure) {
      throw new Exception('Fee structure not found', { status: 404 })
    }

    return structure
  }
}

import FeeChallan from '#models/fee_challan'
import { Exception } from '@adonisjs/core/exceptions'

type Params = {
  id: string
  schoolId: string
}

export default class GetChallan {
  static async handle({ id, schoolId }: Params) {
    const challan = await FeeChallan.query()
      .where('id', id)
      .where('schoolId', schoolId)
      .preload('student')
      .preload('academicYear')
      .preload('enrollment', (q) => q.preload('class').preload('section'))
      .preload('items', (q) => q.preload('feeCategory'))
      .preload('payments')
      .first()

    if (!challan) {
      throw new Exception('Fee challan not found', { status: 404 })
    }

    return challan
  }
}

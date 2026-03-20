import FeeDiscount from '#models/fee_discount'
import StudentDiscount from '#models/student_discount'
import { Exception } from '@adonisjs/core/exceptions'

type Params = {
  id: string
  schoolId: string
}

export default class DeleteFeeDiscount {
  static async handle({ id, schoolId }: Params) {
    const discount = await FeeDiscount.query().where('id', id).where('schoolId', schoolId).first()

    if (!discount) {
      throw new Exception('Fee discount not found', { status: 404 })
    }

    // Check if discount is assigned to students
    const hasAssignments = await StudentDiscount.query().where('feeDiscountId', id).first()

    if (hasAssignments) {
      throw new Exception('Cannot delete discount that is assigned to students', {
        status: 400,
      })
    }

    await discount.delete()
  }
}

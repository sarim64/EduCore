import StudentDiscount from '#models/student_discount'
import { Exception } from '@adonisjs/core/exceptions'

type Params = {
  id: string
  schoolId: string
}

export default class RemoveStudentDiscount {
  static async handle({ id, schoolId }: Params) {
    const assignment = await StudentDiscount.query()
      .where('id', id)
      .where('schoolId', schoolId)
      .first()

    if (!assignment) {
      throw new Exception('Student discount assignment not found', { status: 404 })
    }

    await assignment.delete()
  }
}

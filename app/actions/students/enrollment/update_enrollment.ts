import Enrollment from '#models/enrollment'
import { updateEnrollmentValidator } from '#validators/enrollment'
import type { Infer } from '@vinejs/vine/types'

type Params = {
  id: string
  data: Infer<typeof updateEnrollmentValidator>
}

export default class UpdateEnrollment {
  static async handle({ id, data }: Params) {
    const enrollment = await Enrollment.findOrFail(id)
    await enrollment.merge(data).save()
    return enrollment
  }
}

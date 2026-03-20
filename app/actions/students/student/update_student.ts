import Student from '#models/student'
import { updateStudentValidator } from '#validators/student'
import type { Infer } from '@vinejs/vine/types'
import { DateTime } from 'luxon'

type Params = {
  id: string
  data: Infer<typeof updateStudentValidator>
}

export default class UpdateStudent {
  static async handle({ id, data }: Params) {
    const student = await Student.findOrFail(id)

    await student
      .merge({
        ...data,
        dateOfBirth: data.dateOfBirth ? DateTime.fromJSDate(data.dateOfBirth) : undefined,
        admissionDate: data.admissionDate ? DateTime.fromJSDate(data.admissionDate) : undefined,
      })
      .save()

    return student
  }
}

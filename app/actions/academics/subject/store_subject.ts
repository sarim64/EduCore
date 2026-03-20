import Subject from '#models/subject'
import { createSubjectValidator } from '#validators/subject'
import { Infer } from '@vinejs/vine/types'

type Params = {
  schoolId: string
  data: Infer<typeof createSubjectValidator>
}

export default class StoreSubject {
  static async handle({ schoolId, data }: Params) {
    return Subject.create({
      schoolId,
      name: data.name,
      code: data.code ?? null,
      description: data.description ?? null,
      isElective: data.isElective ?? false,
    })
  }
}

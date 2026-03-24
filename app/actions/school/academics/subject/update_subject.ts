import Subject from '#models/subject'
import { updateSubjectValidator } from '#validators/subject'
import { Infer } from '@vinejs/vine/types'

type Params = {
  subjectId: string
  schoolId: string
  data: Infer<typeof updateSubjectValidator>
}

export default class UpdateSubject {
  static async handle({ subjectId, schoolId, data }: Params) {
    const subject = await Subject.query()
      .where('id', subjectId)
      .where('schoolId', schoolId)
      .firstOrFail()

    subject.merge(data)
    await subject.save()

    return subject
  }
}

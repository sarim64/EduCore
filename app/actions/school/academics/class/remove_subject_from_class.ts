import Subject from '#models/subject'

type Params = {
  schoolId: string
  subjectId: string
  classId: string
}

export default class RemoveSubjectFromClass {
  static async handle({ schoolId, subjectId, classId }: Params) {
    const subject = await Subject.query()
      .where('id', subjectId)
      .where('schoolId', schoolId)
      .firstOrFail()

    await subject.related('classes').detach([classId])

    return subject
  }
}

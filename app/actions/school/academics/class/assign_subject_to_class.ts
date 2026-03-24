import Subject from '#models/subject'
import SchoolClass from '#models/school_class'

type Params = {
  schoolId: string
  classId: string
  subjectId: string
  periodsPerWeek?: number
  isMandatory?: boolean
}

export default class AssignSubjectToClass {
  static async handle({ schoolId, classId, subjectId, periodsPerWeek, isMandatory }: Params) {
    // Verify class belongs to school
    await SchoolClass.query().where('id', classId).where('schoolId', schoolId).firstOrFail()

    // Verify subject belongs to school
    const subject = await Subject.query()
      .where('id', subjectId)
      .where('schoolId', schoolId)
      .firstOrFail()

    // Attach subject to class with pivot data
    await subject.related('classes').attach({
      [classId]: {
        school_id: schoolId,
        periods_per_week: periodsPerWeek ?? 1,
        is_mandatory: isMandatory ?? true,
      },
    })

    return subject
  }
}

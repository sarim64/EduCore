import SchoolClass from '#models/school_class'

type Params = {
  classId: string
  schoolId: string
}

export default class GetClass {
  static async handle({ classId, schoolId }: Params) {
    return SchoolClass.query()
      .where('id', classId)
      .where('schoolId', schoolId)
      .preload('sections')
      .firstOrFail()
  }
}

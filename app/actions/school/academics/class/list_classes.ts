import SchoolClass from '#models/school_class'

type Params = {
  schoolId: string
}

export default class ListClasses {
  static async handle({ schoolId }: Params) {
    return SchoolClass.query()
      .where('schoolId', schoolId)
      .preload('sections')
      .orderBy('displayOrder', 'asc')
  }
}

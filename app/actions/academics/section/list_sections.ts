import Section from '#models/section'

type Params = {
  schoolId: string
  classId?: string
}

export default class ListSections {
  static async handle({ schoolId, classId }: Params) {
    const query = Section.query().where('schoolId', schoolId)

    if (classId) {
      query.where('classId', classId)
    }

    return query.orderBy('name', 'asc')
  }
}

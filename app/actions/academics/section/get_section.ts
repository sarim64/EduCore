import Section from '#models/section'

type Params = {
  sectionId: string
  schoolId: string
}

export default class GetSection {
  static async handle({ sectionId, schoolId }: Params) {
    return Section.query()
      .where('id', sectionId)
      .where('schoolId', schoolId)
      .preload('class')
      .firstOrFail()
  }
}

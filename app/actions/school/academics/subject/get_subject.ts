import Subject from '#models/subject'

type Params = {
  subjectId: string
  schoolId: string
}

export default class GetSubject {
  static async handle({ subjectId, schoolId }: Params) {
    return Subject.query()
      .where('id', subjectId)
      .where('schoolId', schoolId)
      .preload('classes', (query) => {
        query.pivotColumns(['periods_per_week', 'is_mandatory'])
      })
      .firstOrFail()
  }
}

import Subject from '#models/subject'

type Params = {
  schoolId: string
}

export default class ListSubjects {
  static async handle({ schoolId }: Params) {
    return Subject.query()
      .where('schoolId', schoolId)
      .preload('classes', (query) => {
        query.pivotColumns(['periods_per_week', 'is_mandatory'])
      })
      .orderBy('name', 'asc')
  }
}

import School from '#models/school'

type Params = {
  id: string
}

export default class GetSchool {
  static async handle({ id }: Params) {
    return School.query()
      .where('id', id)
      .preload('users', (query) => {
        query.pivotColumns(['role_id'])
      })
      .firstOrFail()
  }
}

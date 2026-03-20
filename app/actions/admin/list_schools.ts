import School from '#models/school'

export default class ListSchools {
  static async handle() {
    return School.query()
      .preload('users', (query) => {
        query.pivotColumns(['role_id'])
      })
      .orderBy('createdAt', 'desc')
  }
}

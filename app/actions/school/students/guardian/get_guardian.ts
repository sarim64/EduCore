import Guardian from '#models/guardian'

type Params = {
  guardianId: string
  schoolId: string
}

export default class GetGuardian {
  static async handle({ guardianId, schoolId }: Params) {
    return Guardian.query()
      .where('id', guardianId)
      .where('schoolId', schoolId)
      .preload('students')
      .firstOrFail()
  }
}

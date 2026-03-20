import Guardian from '#models/guardian'

type Params = {
  guardianId: string
  schoolId: string
}

export default class DeleteGuardian {
  static async handle({ guardianId, schoolId }: Params) {
    const guardian = await Guardian.query()
      .where('id', guardianId)
      .where('schoolId', schoolId)
      .firstOrFail()

    await guardian.delete()
  }
}

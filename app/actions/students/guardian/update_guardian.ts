import Guardian from '#models/guardian'
import { updateGuardianValidator } from '#validators/guardian'
import type { Infer } from '@vinejs/vine/types'

type Params = {
  guardianId: string
  schoolId: string
  data: Infer<typeof updateGuardianValidator>
}

export default class UpdateGuardian {
  static async handle({ guardianId, schoolId, data }: Params) {
    const guardian = await Guardian.query()
      .where('id', guardianId)
      .where('schoolId', schoolId)
      .firstOrFail()

    await guardian.merge(data).save()
    return guardian
  }
}

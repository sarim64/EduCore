import Guardian from '#models/guardian'
import { createGuardianValidator } from '#validators/guardian'
import { Infer } from '@vinejs/vine/types'

type Params = {
  schoolId: string
  data: Infer<typeof createGuardianValidator>
}

export default class StoreGuardian {
  static async handle({ schoolId, data }: Params) {
    const guardian = await Guardian.create({
      schoolId,
      ...data,
    })

    return guardian
  }
}

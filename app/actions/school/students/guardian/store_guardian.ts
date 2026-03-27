import Guardian from '#models/guardian'
import { createGuardianValidator } from '#validators/guardian'
import { Infer } from '@vinejs/vine/types'
import AuditService from '#services/audit_service'
import type { HttpContext } from '@adonisjs/core/http'

type Params = {
  schoolId: string
  data: Infer<typeof createGuardianValidator>
  ctx: HttpContext
  userId: string
}

export default class StoreGuardian {
  static async handle({ schoolId, data, ctx, userId }: Params) {
    const guardian = await Guardian.create({
      schoolId,
      ...data,
    })

    await AuditService.logCreate(
      'Guardian',
      guardian.id,
      { firstName: guardian.firstName, lastName: guardian.lastName, email: guardian.email, phone: guardian.phone },
      ctx,
      schoolId,
      userId
    )

    return guardian
  }
}

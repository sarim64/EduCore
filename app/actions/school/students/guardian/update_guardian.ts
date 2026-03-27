import Guardian from '#models/guardian'
import { updateGuardianValidator } from '#validators/guardian'
import type { Infer } from '@vinejs/vine/types'
import AuditService from '#services/audit_service'
import type { HttpContext } from '@adonisjs/core/http'

type Params = {
  guardianId: string
  schoolId: string
  data: Infer<typeof updateGuardianValidator>
  ctx: HttpContext
  userId: string
}

export default class UpdateGuardian {
  static async handle({ guardianId, schoolId, data, ctx, userId }: Params) {
    const guardian = await Guardian.query()
      .where('id', guardianId)
      .where('schoolId', schoolId)
      .firstOrFail()

    const oldValues = { firstName: guardian.firstName, lastName: guardian.lastName, email: guardian.email, phone: guardian.phone }

    await guardian.merge(data).save()

    await AuditService.logUpdate(
      'Guardian',
      guardian.id,
      oldValues,
      { firstName: guardian.firstName, lastName: guardian.lastName, email: guardian.email, phone: guardian.phone },
      ctx,
      schoolId,
      userId
    )

    return guardian
  }
}

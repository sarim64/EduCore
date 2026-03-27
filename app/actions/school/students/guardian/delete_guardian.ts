import Guardian from '#models/guardian'
import AuditService from '#services/audit_service'
import type { HttpContext } from '@adonisjs/core/http'

type Params = {
  guardianId: string
  schoolId: string
  ctx: HttpContext
  userId: string
}

export default class DeleteGuardian {
  static async handle({ guardianId, schoolId, ctx, userId }: Params) {
    const guardian = await Guardian.query()
      .where('id', guardianId)
      .where('schoolId', schoolId)
      .firstOrFail()

    const oldValues = { firstName: guardian.firstName, lastName: guardian.lastName, email: guardian.email }

    await guardian.delete()

    await AuditService.logDelete('Guardian', guardianId, oldValues, ctx, schoolId, userId)
  }
}

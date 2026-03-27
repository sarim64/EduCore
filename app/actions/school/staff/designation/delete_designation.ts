import Designation from '#models/designation'
import AuditService from '#services/audit_service'
import type { HttpContext } from '@adonisjs/core/http'

type Params = {
  designationId: string
  schoolId: string
  ctx: HttpContext
  userId: string
}

export default class DeleteDesignation {
  static async handle({ designationId, schoolId, ctx, userId }: Params) {
    const designation = await Designation.query()
      .where('id', designationId)
      .where('schoolId', schoolId)
      .firstOrFail()

    const oldValues = { name: designation.name, departmentId: designation.departmentId, isActive: designation.isActive }

    await designation.delete()

    await AuditService.logDelete('Designation', designationId, oldValues, ctx, schoolId, userId)

    return designation
  }
}

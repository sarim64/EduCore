import Designation from '#models/designation'
import { updateDesignationValidator } from '#validators/designation'
import { Infer } from '@vinejs/vine/types'
import AuditService from '#services/audit_service'
import type { HttpContext } from '@adonisjs/core/http'

type Params = {
  designationId: string
  schoolId: string
  data: Infer<typeof updateDesignationValidator>
  ctx: HttpContext
  userId: string
}

export default class UpdateDesignation {
  static async handle({ designationId, schoolId, data, ctx, userId }: Params) {
    const designation = await Designation.query()
      .where('id', designationId)
      .where('schoolId', schoolId)
      .firstOrFail()

    const oldValues = { name: designation.name, departmentId: designation.departmentId, isActive: designation.isActive }

    designation.merge(data)
    await designation.save()

    await AuditService.logUpdate(
      'Designation',
      designation.id,
      oldValues,
      { name: designation.name, departmentId: designation.departmentId, isActive: designation.isActive },
      ctx,
      schoolId,
      userId
    )

    return designation
  }
}

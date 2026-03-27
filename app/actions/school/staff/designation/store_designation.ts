import Designation from '#models/designation'
import { createDesignationValidator } from '#validators/designation'
import { Infer } from '@vinejs/vine/types'
import AuditService from '#services/audit_service'
import type { HttpContext } from '@adonisjs/core/http'

type Params = {
  schoolId: string
  data: Infer<typeof createDesignationValidator>
  ctx: HttpContext
  userId: string
}

export default class StoreDesignation {
  static async handle({ schoolId, data, ctx, userId }: Params) {
    const desig = await Designation.create({
      schoolId,
      departmentId: data.departmentId,
      name: data.name,
      description: data.description ?? null,
      isActive: data.isActive ?? true,
    })

    await AuditService.logCreate(
      'Designation',
      desig.id,
      { name: desig.name, departmentId: desig.departmentId, isActive: desig.isActive },
      ctx,
      schoolId,
      userId
    )

    return desig
  }
}

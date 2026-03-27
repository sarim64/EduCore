import Department from '#models/department'
import { createDepartmentValidator } from '#validators/department'
import { Infer } from '@vinejs/vine/types'
import AuditService from '#services/audit_service'
import type { HttpContext } from '@adonisjs/core/http'

type Params = {
  schoolId: string
  data: Infer<typeof createDepartmentValidator>
  ctx: HttpContext
  userId: string
}

export default class StoreDepartment {
  static async handle({ schoolId, data, ctx, userId }: Params) {
    const dept = await Department.create({
      schoolId,
      name: data.name,
      description: data.description ?? null,
      isActive: data.isActive ?? true,
    })

    await AuditService.logCreate(
      'Department',
      dept.id,
      { name: dept.name, isActive: dept.isActive },
      ctx,
      schoolId,
      userId
    )

    return dept
  }
}

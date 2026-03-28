import Department from '#models/department'
import { updateDepartmentValidator } from '#validators/department'
import { Infer } from '@vinejs/vine/types'
import AuditService from '#services/audit_service'
import type { HttpContext } from '@adonisjs/core/http'

type Params = {
  departmentId: string
  schoolId: string
  data: Infer<typeof updateDepartmentValidator>
  ctx: HttpContext
  userId: string
}

export default class UpdateDepartment {
  static async handle({ departmentId, schoolId, data, ctx, userId }: Params) {
    const department = await Department.query()
      .where('id', departmentId)
      .where('schoolId', schoolId)
      .firstOrFail()

    const oldValues = { name: department.name, description: department.description, isActive: department.isActive }

    department.merge(data)
    await department.save()

    await AuditService.logUpdate(
      'Department',
      department.id,
      oldValues,
      { name: department.name, description: department.description, isActive: department.isActive },
      ctx,
      schoolId,
      userId
    )

    return department
  }
}

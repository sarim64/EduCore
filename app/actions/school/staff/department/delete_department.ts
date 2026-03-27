import Department from '#models/department'
import AuditService from '#services/audit_service'
import type { HttpContext } from '@adonisjs/core/http'

type Params = {
  departmentId: string
  schoolId: string
  ctx: HttpContext
  userId: string
}

export default class DeleteDepartment {
  static async handle({ departmentId, schoolId, ctx, userId }: Params) {
    const department = await Department.query()
      .where('id', departmentId)
      .where('schoolId', schoolId)
      .firstOrFail()

    const oldValues = { name: department.name, isActive: department.isActive }

    await department.delete()

    await AuditService.logDelete('Department', departmentId, oldValues, ctx, schoolId, userId)

    return department
  }
}

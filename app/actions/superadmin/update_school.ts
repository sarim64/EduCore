import School from '#models/school'
import SuperAdmin from '#models/super_admin'
import AdminAuditLog from '#models/admin_audit_log'
import { adminUpdateSchoolValidator } from '#validators/admin'
import { Infer } from '@vinejs/vine/types'
import db from '@adonisjs/lucid/services/db'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

type Params = {
  school: School
  data: Infer<typeof adminUpdateSchoolValidator>
  superAdmin: SuperAdmin
}

@inject()
export default class UpdateSchool {
  constructor(protected ctx: HttpContext) {}

  async handle({ school, data, superAdmin }: Params) {
    return db.transaction(async (trx) => {
      const oldValues = {
        name: school.name,
        code: school.code,
        address: school.address,
        phone: school.phone,
        city: school.city,
        province: school.province,
      }

      school.useTransaction(trx)
      school.merge(data)
      await school.save()

      // Log the action
      await AdminAuditLog.create(
        {
          superAdminId: superAdmin.id,
          action: 'update_school',
          entityType: 'school',
          entityId: school.id,
          targetSchoolId: school.id,
          oldValues,
          newValues: data as Record<string, unknown>,
          ipAddress: this.ctx.request.ip(),
          userAgent: this.ctx.request.header('user-agent'),
          description: `Updated school: ${school.name}`,
        },
        { client: trx }
      )

      return school
    })
  }
}

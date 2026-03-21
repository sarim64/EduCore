import School from '#models/school'
import SuperAdmin from '#models/super_admin'
import AdminAuditLog from '#models/admin_audit_log'
import db from '@adonisjs/lucid/services/db'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

type Params = {
  school: School
  superAdmin: SuperAdmin
}

@inject()
export default class DeleteSchool {
  constructor(protected ctx: HttpContext) {}

  async handle({ school, superAdmin }: Params) {
    return db.transaction(async (trx) => {
      const oldValues = {
        id: school.id,
        name: school.name,
        code: school.code,
        address: school.address,
        phone: school.phone,
      }

      // Log the action before deleting
      await AdminAuditLog.create(
        {
          superAdminId: superAdmin.id,
          action: 'delete_school',
          entityType: 'school',
          entityId: school.id,
          targetSchoolId: null, // Set to null since school is being deleted
          oldValues,
          ipAddress: this.ctx.request.ip(),
          userAgent: this.ctx.request.header('user-agent'),
          description: `Deleted school: ${school.name}`,
        },
        { client: trx }
      )

      school.useTransaction(trx)
      await school.delete()

      return true
    })
  }
}

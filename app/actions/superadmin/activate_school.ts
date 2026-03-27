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
export default class ActivateSchool {
  constructor(protected ctx: HttpContext) {}

  async handle({ school, superAdmin }: Params) {
    return db.transaction(async (trx) => {
      school.useTransaction(trx)
      school.isSuspended = false
      await school.save()

      await AdminAuditLog.create(
        {
          superAdminId: superAdmin.id,
          action: 'activate',
          entityType: 'school',
          entityId: school.id,
          targetSchoolId: school.id,
          oldValues: { isSuspended: true },
          newValues: { isSuspended: false },
          ipAddress: this.ctx.request.ip(),
          userAgent: this.ctx.request.header('user-agent'),
          description: `Activated school: ${school.name}`,
        },
        { client: trx }
      )
    })
  }
}

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
export default class SuspendSchool {
  constructor(protected ctx: HttpContext) {}

  async handle({ school, superAdmin }: Params) {
    return db.transaction(async (trx) => {
      school.useTransaction(trx)
      school.isSuspended = true
      await school.save()

      await AdminAuditLog.create(
        {
          superAdminId: superAdmin.id,
          action: 'suspend',
          entityType: 'school',
          entityId: school.id,
          targetSchoolId: school.id,
          oldValues: { isSuspended: false },
          newValues: { isSuspended: true },
          ipAddress: this.ctx.request.ip(),
          userAgent: this.ctx.request.header('user-agent'),
          description: `Suspended school: ${school.name}`,
        },
        { client: trx }
      )
    })
  }
}

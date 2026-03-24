import School from '#models/school'
import User from '#models/user'
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

      // Find users who belong only to this school (not members of any other school)
      const schoolUserRows: { user_id: string }[] = await db
        .from('school_users')
        .where('school_id', school.id)
        .select('user_id')

      const schoolUserIds = schoolUserRows.map((r) => r.user_id)

      let exclusiveUserIds: string[] = []
      if (schoolUserIds.length > 0) {
        const sharedRows: { user_id: string }[] = await db
          .from('school_users')
          .whereIn('user_id', schoolUserIds)
          .whereNot('school_id', school.id)
          .select('user_id')

        const sharedIds = new Set(sharedRows.map((r) => r.user_id))
        exclusiveUserIds = schoolUserIds.filter((id) => !sharedIds.has(id))
      }

      school.useTransaction(trx)
      await school.delete()

      if (exclusiveUserIds.length > 0) {
        await User.query({ client: trx }).whereIn('id', exclusiveUserIds).delete()
      }

      return true
    })
  }
}

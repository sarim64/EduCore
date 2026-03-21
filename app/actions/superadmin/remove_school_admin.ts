import School from '#models/school'
import User from '#models/user'
import SuperAdmin from '#models/super_admin'
import AdminAuditLog from '#models/admin_audit_log'
import db from '@adonisjs/lucid/services/db'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import Roles from '#enums/roles'

type Params = {
  school: School
  user: User
  superAdmin: SuperAdmin
}

@inject()
export default class RemoveSchoolAdmin {
  constructor(protected ctx: HttpContext) {}

  async handle({ school, user, superAdmin }: Params) {
    return db.transaction(async (trx) => {
      const adminCountRow = await db
        .from('school_users')
        .where('school_id', school.id)
        .andWhere('role_id', Roles.SCHOOL_ADMIN)
        .count('* as total')
        .first()

      const adminCount = Number(adminCountRow?.total ?? 0)
      if (adminCount <= 1) {
        const error = new Error('Cannot remove the last admin from a school') as Error & {
          code: string
        }
        error.code = 'E_LAST_SCHOOL_ADMIN'
        throw error
      }

      const oldValues = {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      }

      // Remove user from school
      await school.related('users').detach([user.id], trx)

      // Delete user entirely if they belong to no other schools
      const otherSchoolCount = await db
        .from('school_users')
        .where('user_id', user.id)
        .count('* as total')
        .first()

      if (Number(otherSchoolCount?.total ?? 0) === 0) {
        await db.from('password_reset_tokens').where('user_id', user.id).delete().useTransaction(trx)
        await User.query({ client: trx }).where('id', user.id).delete()
      }

      // Log the action
      await AdminAuditLog.create(
        {
          superAdminId: superAdmin.id,
          action: 'remove_admin',
          entityType: 'school_user',
          entityId: user.id,
          targetSchoolId: school.id,
          targetUserId: user.id,
          oldValues,
          ipAddress: this.ctx.request.ip(),
          userAgent: this.ctx.request.header('user-agent'),
          description: `Removed admin ${user.email} from school: ${school.name}`,
        },
        { client: trx }
      )

      return true
    })
  }
}

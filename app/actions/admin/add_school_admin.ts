import School from '#models/school'
import User from '#models/user'
import SuperAdmin from '#models/super_admin'
import AdminAuditLog from '#models/admin_audit_log'
import { addSchoolAdminValidator } from '#validators/admin'
import { Infer } from '@vinejs/vine/types'
import db from '@adonisjs/lucid/services/db'
import Roles from '#enums/roles'
import hash from '@adonisjs/core/services/hash'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

type Params = {
  school: School
  data: Infer<typeof addSchoolAdminValidator>
  superAdmin: SuperAdmin
}

@inject()
export default class AddSchoolAdmin {
  constructor(protected ctx: HttpContext) {}

  async handle({ school, data, superAdmin }: Params) {
    return db.transaction(async (trx) => {
      let user = await User.findBy('email', data.email)
      let isNewUser = false

      if (!user) {
        isNewUser = true
        const password = data.password || 'changeme123'
        user = await User.create(
          {
            firstName: data.firstName,
            lastName: data.lastName || null,
            email: data.email,
            password: await hash.make(password),
          },
          { client: trx }
        )
      }

      // Check if user is already an admin of this school
      await school.load('users', (query) => {
        query.wherePivot('user_id', user!.id)
      })

      if (school.users.length === 0) {
        await school.related('users').attach(
          {
            [user.id]: { role_id: Roles.SCHOOL_ADMIN },
          },
          trx
        )
      }

      // Log the action
      await AdminAuditLog.create(
        {
          superAdminId: superAdmin.id,
          action: 'add_admin',
          entityType: 'school_user',
          entityId: user.id,
          targetSchoolId: school.id,
          targetUserId: user.id,
          newValues: {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            isNewUser,
          },
          ipAddress: this.ctx.request.ip(),
          userAgent: this.ctx.request.header('user-agent'),
          description: `Added admin ${user.email} to school: ${school.name}`,
        },
        { client: trx }
      )

      return user
    })
  }
}

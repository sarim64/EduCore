import School from '#models/school'
import User from '#models/user'
import SuperAdmin from '#models/super_admin'
import AdminAuditLog from '#models/admin_audit_log'
import { adminCreateSchoolValidator } from '#validators/admin'
import { Infer } from '@vinejs/vine/types'
import db from '@adonisjs/lucid/services/db'
import Roles from '#enums/roles'
import hash from '@adonisjs/core/services/hash'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

type Params = {
  data: Infer<typeof adminCreateSchoolValidator>
  superAdmin: SuperAdmin
}

@inject()
export default class StoreSchool {
  constructor(protected ctx: HttpContext) {}

  async handle({ data, superAdmin }: Params) {
    return db.transaction(async (trx) => {
      const { adminEmail, adminFirstName, adminLastName, ...schoolData } = data

      const school = await School.create(schoolData, { client: trx })

      // If admin details provided, create or find user and assign as admin
      if (adminEmail && adminFirstName) {
        let admin = await User.findBy('email', adminEmail)

        if (!admin) {
          admin = await User.create(
            {
              firstName: adminFirstName,
              lastName: adminLastName || null,
              email: adminEmail,
              password: await hash.make('changeme123'),
            },
            { client: trx }
          )
        }

        await school.related('users').attach(
          {
            [admin.id]: { role_id: Roles.SCHOOL_ADMIN },
          },
          trx
        )
      }

      // Log the action
      await AdminAuditLog.create(
        {
          superAdminId: superAdmin.id,
          action: 'create_school',
          entityType: 'school',
          entityId: school.id,
          targetSchoolId: school.id,
          newValues: schoolData as Record<string, unknown>,
          ipAddress: this.ctx.request.ip(),
          userAgent: this.ctx.request.header('user-agent'),
          description: `Created school: ${school.name}`,
        },
        { client: trx }
      )

      return school
    })
  }
}

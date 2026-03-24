import School from '#models/school'
import User from '#models/user'
import SuperAdmin from '#models/super_admin'
import AdminAuditLog from '#models/admin_audit_log'
import PasswordResetToken from '#models/password_reset_token'
import { adminCreateSchoolValidator } from '#validators/admin'
import { Infer } from '@vinejs/vine/types'
import db from '@adonisjs/lucid/services/db'
import Roles from '#enums/roles'
import string from '@adonisjs/core/helpers/string'
import encryption from '@adonisjs/core/services/encryption'
import { DateTime } from 'luxon'
import router from '@adonisjs/core/services/router'
import env from '#start/env'
import mail from '@adonisjs/mail/services/main'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

type Params = {
  data: Infer<typeof adminCreateSchoolValidator>
  superAdmin: SuperAdmin
}

type ActivationPayload = {
  user: User
  school: School
  welcomeLink: string
} | null

@inject()
export default class StoreSchool {
  constructor(protected ctx: HttpContext) {}

  async handle({ data, superAdmin }: Params) {
    const activation = await db.transaction<ActivationPayload>(async (trx) => {
      const { adminEmail, adminFirstName, adminLastName, ...schoolData } = data

      const school = await School.create(schoolData, { client: trx })

      let activation: ActivationPayload = null

      // If admin details provided, create or find user and assign as admin
      if (adminEmail && adminFirstName) {
        let admin = await User.findBy('email', adminEmail)
        if (!admin) {
          admin = await User.create(
            {
              firstName: adminFirstName,
              lastName: adminLastName || null,
              email: adminEmail,
              password: string.generateRandom(32),
              mustSetPassword: true,
            },
            { client: trx }
          )

          const value = string.generateRandom(32)
          const encryptedValue = encryption.encrypt(value)

          await PasswordResetToken.create(
            {
              userId: admin.id,
              value,
              expiresAt: DateTime.now().plus({ hours: 48 }),
            },
            { client: trx }
          )

          const welcomeLink = router
            .builder()
            .prefixUrl(env.get('APP_URL'))
            .params({ value: encryptedValue })
            .make('forgot_password.reset')

          activation = { user: admin, school, welcomeLink }
        }

        await school.related('users').attach({ [admin.id]: { role_id: Roles.SCHOOL_ADMIN } }, trx)
      }

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

      return activation
    })

    if (activation) {
      await mail.send((message) => {
        message
          .subject('Welcome to EduCore – Set Your Password')
          .to(activation!.user.email)
          .from(env.get('MAIL_FROM'))
          .htmlView('emails/welcome_admin', {
            user: activation!.user,
            welcomeLink: activation!.welcomeLink,
            school: activation!.school,
          })
      })
    }
  }
}

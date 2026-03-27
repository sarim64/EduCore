import School from '#models/school'
import User from '#models/user'
import SuperAdmin from '#models/super_admin'
import AdminAuditLog from '#models/admin_audit_log'
import PasswordResetToken from '#models/password_reset_token'
import { addSchoolAdminValidator } from '#validators/admin'
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
  school: School
  data: Infer<typeof addSchoolAdminValidator>
  superAdmin: SuperAdmin
}

type ActivationPayload = {
  user: User
  welcomeLink: string
} | null

@inject()
export default class AddSchoolAdmin {
  constructor(protected ctx: HttpContext) {}

  async handle({ school, data, superAdmin }: Params) {
    const activation = await db.transaction<ActivationPayload>(async (trx) => {
      let user = await User.findBy('email', data.email)
      let isNewUser = false
      let welcomeLink = ''

      if (!user) {
        isNewUser = true

        user = await User.create(
          {
            firstName: data.firstName,
            lastName: data.lastName ?? null,
            email: data.email,
            password: string.generateRandom(32),
            mustSetPassword: true,
          },
          { client: trx }
        )

        const value = string.generateRandom(32)
        const encryptedValue = encryption.encrypt(value)

        await PasswordResetToken.create(
          {
            userId: user.id,
            value,
            expiresAt: DateTime.now().plus({ hours: 48 }),
          },
          { client: trx }
        )

        welcomeLink = router
          .builder()
          .prefixUrl(env.get('APP_URL'))
          .params({ value: encryptedValue })
          .make('forgot_password.reset')
      }

      // Attach school admin role if not already assigned
      const existingRow = await trx
        .from('school_users')
        .where('school_id', school.id)
        .where('user_id', user.id)
        .first()

      if (!existingRow) {
        await school.related('users').attach(
          { [user.id]: { role_id: Roles.SCHOOL_ADMIN } },
          trx
        )
      }

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

      return isNewUser ? { user, welcomeLink } : null
    })

    if (activation) {
      await mail.send((message) => {
        message
          .subject('Welcome to EduCore – Set Your Password')
          .to(activation.user.email)
          .from(env.get('MAIL_FROM'))
          .htmlView('emails/welcome_admin', {
            user: activation.user,
            welcomeLink: activation.welcomeLink,
            school,
          })
      })
    }
  }
}

import School from '#models/school'
import User from '#models/user'
import SchoolInvite from '#models/school_invite'
import AuditService from '#services/audit_service'
import { sendInviteValidator } from '#validators/invite'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { Infer } from '@vinejs/vine/types'
import { Exception } from '@adonisjs/core/exceptions'
import string from '@adonisjs/core/helpers/string'
import encryption from '@adonisjs/core/services/encryption'
import { DateTime } from 'luxon'
import router from '@adonisjs/core/services/router'
import env from '#start/env'
import mail from '@adonisjs/mail/services/main'
import db from '@adonisjs/lucid/services/db'

type Params = {
  school: School
  data: Infer<typeof sendInviteValidator>
  invitedByUser: User
}

@inject()
export default class SendInvite {
  constructor(protected ctx: HttpContext) {}

  async handle({ school, data, invitedByUser }: Params) {
    // Check for existing pending invite for this email at this school
    const existingInvite = await SchoolInvite.query()
      .where('schoolId', school.id)
      .whereRaw('LOWER(email) = LOWER(?)', [data.email])
      .whereNull('acceptedAt')
      .whereNull('cancelledAt')
      .where('expiresAt', '>', DateTime.now().toSQL()!)
      .first()

    if (existingInvite) {
      throw new Exception('An invitation is already pending for this email address.', {
        status: 422,
        code: 'E_INVITE_ALREADY_PENDING',
      })
    }

    // Check if user is already a member of this school
    const userWithEmail = await User.query()
      .whereRaw('LOWER(email) = LOWER(?)', [data.email])
      .first()

    if (userWithEmail) {
      const existingMember = await db
        .from('school_users')
        .where('school_id', school.id)
        .where('user_id', userWithEmail.id)
        .first()

      if (existingMember) {
        throw new Exception('This person is already a member of the school.', {
          status: 422,
          code: 'E_ALREADY_MEMBER',
        })
      }
    }

    // Generate token: raw value stored in DB, encrypted value goes in the URL
    const token = string.generateRandom(64)
    const encryptedToken = encryption.encrypt(token)

    const invite = await SchoolInvite.create({
      schoolId: school.id,
      email: data.email.toLowerCase(),
      roleId: data.roleId,
      invitedByUserId: invitedByUser.id,
      token,
      expiresAt: DateTime.now().plus({ days: 7 }),
    })

    await invite.load('role')

    const inviteLink = router
      .builder()
      .prefixUrl(env.get('APP_URL'))
      .params({ token: encryptedToken })
      .make('invite.accept.show')

    await mail.send((message) => {
      message
        .subject(`You have been invited to join ${school.name} on EduCore`)
        .to(invite.email)
        .from(env.get('MAIL_FROM'))
        .htmlView('emails/school_invite', {
          school,
          roleName: invite.role.name,
          invitedByUser,
          inviteLink,
        })
    })

    await AuditService.log(
      {
        schoolId: school.id,
        userId: invitedByUser.id,
        action: 'send_invite',
        entityType: 'SchoolInvite',
        entityId: invite.id,
        newValues: { email: invite.email, roleId: invite.roleId },
        description: `Sent invite to ${invite.email}`,
      },
      this.ctx
    )
  }
}

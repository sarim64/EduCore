import School from '#models/school'
import SchoolInvite from '#models/school_invite'
import User from '#models/user'
import { acceptInviteValidator } from '#validators/invite'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { Infer } from '@vinejs/vine/types'
import { Exception } from '@adonisjs/core/exceptions'
import encryption from '@adonisjs/core/services/encryption'
import { DateTime } from 'luxon'
import db from '@adonisjs/lucid/services/db'

type Params = {
  data: Infer<typeof acceptInviteValidator>
}

@inject()
export default class AcceptInvite {
  constructor(protected ctx: HttpContext) {}

  async handle({ data }: Params) {
    // Decrypt the URL token to get the raw stored value
    const rawToken = encryption.decrypt<string>(data.token)

    if (!rawToken) {
      throw new Exception('This invitation link is invalid.', {
        status: 422,
        code: 'E_INVITE_INVALID',
      })
    }

    const invite = await SchoolInvite.findBy('token', rawToken)

    if (!invite || !invite.isPending) {
      throw new Exception('This invitation is invalid, expired, or has already been used.', {
        status: 422,
        code: 'E_INVITE_INVALID',
      })
    }

    const user = await db.transaction(async (trx) => {
      let user = await User.findBy('email', invite.email)

      if (!user) {
        // New user — requires firstName and password
        if (!data.firstName || !data.password) {
          throw new Exception('First name and password are required to create your account.', {
            status: 422,
            code: 'E_VALIDATION_ERROR',
          })
        }

        user = await User.create(
          {
            firstName: data.firstName,
            lastName: data.lastName ?? null,
            email: invite.email,
            password: data.password,
            mustSetPassword: false,
          },
          { client: trx }
        )
      }

      // Attach user to the school with the invited role (skip if already a member)
      const alreadyMember = await db
        .from('school_users')
        .where('school_id', invite.schoolId)
        .where('user_id', user.id)
        .first()

      if (!alreadyMember) {
        const school = await School.findOrFail(invite.schoolId, { client: trx })
        await school.related('users').attach({ [user.id]: { role_id: invite.roleId } }, trx)
      }

      // Mark invite as accepted and clear the token
      invite.useTransaction(trx)
      invite.acceptedAt = DateTime.now()
      invite.token = null
      await invite.save()

      return user
    })

    await this.ctx.auth.use('web').login(user)
    this.ctx.session.put('schoolId', invite.schoolId)

    return user
  }
}

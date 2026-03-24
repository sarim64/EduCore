import SchoolInvite from '#models/school_invite'
import User from '#models/user'
import encryption from '@adonisjs/core/services/encryption'

type Params = {
  encryptedToken: string
}

export default class VerifyInviteToken {
  static async handle({ encryptedToken }: Params) {
    let rawToken: string | null = null

    try {
      rawToken = encryption.decrypt<string>(encryptedToken)
    } catch {
      return { isValid: false, invite: null, isNewUser: false }
    }

    if (!rawToken) {
      return { isValid: false, invite: null, isNewUser: false }
    }

    const invite = await SchoolInvite.query()
      .where('token', rawToken)
      .preload('school')
      .preload('role')
      .preload('invitedByUser')
      .first()

    if (!invite || !invite.isPending) {
      return { isValid: false, invite, isNewUser: false }
    }

    const existingUser = await User.findBy('email', invite.email)

    return {
      isValid: true,
      invite,
      isNewUser: !existingUser,
    }
  }
}

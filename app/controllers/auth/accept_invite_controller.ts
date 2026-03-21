import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import VerifyInviteToken from '#actions/invites/verify_invite_token'
import AcceptInvite from '#actions/invites/accept_invite'
import { acceptInviteValidator } from '#validators/invite'

export default class AcceptInviteController {
  async show({ params, inertia }: HttpContext) {
    const { isValid, invite, isNewUser } = await VerifyInviteToken.handle({
      encryptedToken: params.token,
    })

    return inertia.render('auth/accept_invite', {
      isValid,
      isNewUser,
      token: params.token,
      schoolName: invite?.school?.name ?? null,
      roleName: invite?.role?.name ?? null,
      email: invite?.email ?? null,
    })
  }

  @inject()
  async store({ request, response, session }: HttpContext, action: AcceptInvite) {
    const data = await request.validateUsing(acceptInviteValidator)

    try {
      await action.handle({ data })
      session.flash('success', 'Welcome! Your account has been set up successfully.')
      return response.redirect().toRoute('dashboard')
    } catch (error) {
      session.flash('error', error.message)
      return response.redirect().toRoute('invite.accept.show', { token: data.token })
    }
  }
}

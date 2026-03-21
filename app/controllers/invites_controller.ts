import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import SchoolInviteDto from '#dtos/school_invite'
import RoleDto from '#dtos/role'
import ListInvites from '#actions/invites/list_invites'
import GetInvitableRoles from '#actions/invites/get_invitable_roles'
import SendInvite from '#actions/invites/send_invite'
import CancelInvite from '#actions/invites/cancel_invite'
import { sendInviteValidator } from '#validators/invite'

export default class InvitesController {
  async index({ inertia, school }: HttpContext) {
    const invites = await ListInvites.handle({ school: school! })

    return inertia.render('invites/index', {
      invites: SchoolInviteDto.fromArray(invites),
    })
  }

  async create({ inertia }: HttpContext) {
    const roles = await GetInvitableRoles.handle()

    return inertia.render('invites/create', {
      invitableRoles: RoleDto.fromArray(roles),
    })
  }

  @inject()
  async store({ request, response, session, auth, school }: HttpContext, action: SendInvite) {
    const data = await request.validateUsing(sendInviteValidator)

    try {
      await action.handle({ school: school!, data, invitedByUser: auth.user! })
      session.flash('success', 'Invitation sent successfully')
    } catch (error) {
      session.flash('error', error.message)
    }

    return response.redirect().toRoute('invites.index')
  }

  @inject()
  async destroy({ params, response, session, auth, school }: HttpContext, action: CancelInvite) {
    try {
      await action.handle({
        inviteId: params.id,
        school: school!,
        cancelledByUser: auth.user!,
      })
      session.flash('success', 'Invitation cancelled')
    } catch (error) {
      session.flash('error', error.message)
    }

    return response.redirect().toRoute('invites.index')
  }
}

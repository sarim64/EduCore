import School from '#models/school'
import User from '#models/user'
import SchoolInvite from '#models/school_invite'
import AuditService from '#services/audit_service'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { Exception } from '@adonisjs/core/exceptions'
import { DateTime } from 'luxon'

type Params = {
  inviteId: string
  school: School
  cancelledByUser: User
}

@inject()
export default class CancelInvite {
  constructor(protected ctx: HttpContext) {}

  async handle({ inviteId, school, cancelledByUser }: Params) {
    const invite = await SchoolInvite.query()
      .where('id', inviteId)
      .where('schoolId', school.id)
      .firstOrFail()

    if (!invite.isPending) {
      throw new Exception('This invitation is no longer pending and cannot be cancelled.', {
        status: 422,
        code: 'E_INVITE_NOT_PENDING',
      })
    }

    invite.cancelledAt = DateTime.now()
    invite.cancelledByUserId = cancelledByUser.id
    invite.token = null
    await invite.save()

    await AuditService.log(
      {
        schoolId: school.id,
        userId: cancelledByUser.id,
        action: 'cancel_invite',
        entityType: 'SchoolInvite',
        entityId: invite.id,
        oldValues: { email: invite.email, roleId: invite.roleId },
        description: `Cancelled invite for ${invite.email}`,
      },
      this.ctx
    )
  }
}

import { BaseModelDto } from '@adocasts.com/dto/base'
import SchoolInvite from '#models/school_invite'
import { DateTime } from 'luxon'

type InviteStatus = 'pending' | 'accepted' | 'cancelled' | 'expired'

function computeStatus(invite: SchoolInvite): InviteStatus {
  if (invite.acceptedAt) return 'accepted'
  if (invite.cancelledAt) return 'cancelled'
  if (!invite.expiresAt || invite.expiresAt <= DateTime.now()) return 'expired'
  return 'pending'
}

export default class SchoolInviteDto extends BaseModelDto {
  declare id: string
  declare schoolId: string
  declare email: string
  declare roleId: number
  declare roleName: string
  declare status: InviteStatus
  declare invitedByUser: { id: string; fullName: string } | null
  declare expiresAt: string | null
  declare acceptedAt: string | null
  declare cancelledAt: string | null
  declare createdAt: string

  constructor(schoolInvite?: SchoolInvite) {
    super()

    if (!schoolInvite) return
    this.id = schoolInvite.id
    this.schoolId = schoolInvite.schoolId
    this.email = schoolInvite.email
    this.roleId = schoolInvite.roleId
    this.roleName = schoolInvite.role?.name ?? ''
    this.status = computeStatus(schoolInvite)
    this.invitedByUser = schoolInvite.invitedByUser
      ? {
          id: schoolInvite.invitedByUser.id,
          fullName: schoolInvite.invitedByUser.fullName,
        }
      : null
    this.expiresAt = schoolInvite.expiresAt?.toISO() ?? null
    this.acceptedAt = schoolInvite.acceptedAt?.toISO() ?? null
    this.cancelledAt = schoolInvite.cancelledAt?.toISO() ?? null
    this.createdAt = schoolInvite.createdAt.toISO()!
  }
}

export type InviteStatus = 'pending' | 'accepted' | 'cancelled' | 'expired'

export type SchoolInvite = {
  id: string
  schoolId: string
  email: string
  roleId: number
  roleName: string
  status: InviteStatus
  invitedByUser: { id: string; fullName: string } | null
  expiresAt: string | null
  acceptedAt: string | null
  cancelledAt: string | null
  createdAt: string
}

export type InvitableRole = {
  id: number
  name: string
}

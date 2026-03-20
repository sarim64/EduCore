import { BaseModelDto } from '@adocasts.com/dto/base'
import SchoolInvite from '#models/school_invite'
import UserDto from '#dtos/user'
import RoleDto from '#dtos/role'
import SchoolDto from './school.js'

export default class SchoolInviteDto extends BaseModelDto {
  declare id: string
  declare schoolId: string
  declare invitedByUserId: string
  declare cancelledByUserId: string | null
  declare email: string
  declare roleId: number
  declare acceptedAt: string | null
  declare cancelledAt: string | null
  declare createdAt: string
  declare updatedAt: string
  declare invitedByUser: UserDto | null
  declare cancelledByUser: UserDto | null
  declare role: RoleDto | null
  declare school: SchoolDto | null

  constructor(schoolInvite?: SchoolInvite) {
    super()

    if (!schoolInvite) return
    this.id = schoolInvite.id
    this.schoolId = schoolInvite.schoolId
    this.invitedByUserId = schoolInvite.invitedByUserId
    this.cancelledByUserId = schoolInvite.cancelledByUserId
    this.email = schoolInvite.email
    this.roleId = schoolInvite.roleId
    this.acceptedAt = schoolInvite.acceptedAt?.toISO()!
    this.cancelledAt = schoolInvite.cancelledAt?.toISO()!
    this.createdAt = schoolInvite.createdAt.toISO()!
    this.updatedAt = schoolInvite.updatedAt.toISO()!
    this.invitedByUser = schoolInvite.invitedByUser && new UserDto(schoolInvite.invitedByUser)
    this.cancelledByUser = schoolInvite.cancelledByUser && new UserDto(schoolInvite.cancelledByUser)
    this.role = schoolInvite.role && new RoleDto(schoolInvite.role)
    this.school = schoolInvite.school && new SchoolDto(schoolInvite.school)
  }
}

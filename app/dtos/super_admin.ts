import { BaseModelDto } from '@adocasts.com/dto/base'
import SuperAdmin from '#models/super_admin'
import UserDto from '#dtos/user'

export default class SuperAdminDto extends BaseModelDto {
  declare id: string
  declare userId: string
  declare grantedByUserId: string | null
  declare grantedAt: string
  declare revokedByUserId: string | null
  declare revokedAt: string | null
  declare notes: string | null
  declare isActive: boolean
  declare createdAt: string
  declare updatedAt: string | null
  declare user: UserDto | null

  constructor(superAdmin?: SuperAdmin) {
    super()

    if (!superAdmin) return
    this.id = superAdmin.id
    this.userId = superAdmin.userId
    this.grantedByUserId = superAdmin.grantedByUserId
    this.grantedAt = superAdmin.grantedAt.toISO()!
    this.revokedByUserId = superAdmin.revokedByUserId
    this.revokedAt = superAdmin.revokedAt?.toISO() ?? null
    this.notes = superAdmin.notes
    this.isActive = superAdmin.isActive
    this.createdAt = superAdmin.createdAt.toISO()!
    this.updatedAt = superAdmin.updatedAt?.toISO() ?? null
    this.user = superAdmin.user ? new UserDto(superAdmin.user) : null
  }
}

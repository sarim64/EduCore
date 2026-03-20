import { BaseModelDto } from '@adocasts.com/dto/base'
import School from '#models/school'
import SchoolInviteDto from '#dtos/school_invite'
import UserDto from '#dtos/user'

export default class SchoolDto extends BaseModelDto {
  declare id: string
  declare name: string
  declare code: string | null
  declare address: string | null
  declare phone: string | null
  declare logoUrl: string | null
  declare settings: Record<string, unknown>
  declare createdAt: string
  declare updatedAt: string
  declare invites: SchoolInviteDto[]
  declare users: UserDto[]

  constructor(school?: School) {
    super()

    if (!school) return
    this.id = school.id
    this.name = school.name
    this.code = school.code
    this.address = school.address
    this.phone = school.phone
    this.logoUrl = school.logoUrl
    this.settings = school.settings
    this.createdAt = school.createdAt?.toISO() || new Date().toISOString()
    this.updatedAt = school.updatedAt?.toISO() || new Date().toISOString()
    this.invites = SchoolInviteDto.fromArray(school.invites)
    this.users = UserDto.fromArray(school.users)
  }
}

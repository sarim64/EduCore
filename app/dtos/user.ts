import { BaseModelDto } from '@adocasts.com/dto/base'
import User from '#models/user'
import PasswordResetTokenDto from '#dtos/password_reset_token'
import SchoolDto from '#dtos/school'

export default class UserDto extends BaseModelDto {
  declare id: string
  declare firstName: string
  declare lastName: string | null
  declare email: string
  declare fullName: string
  declare createdAt: string
  declare updatedAt: string | null
  declare passwordResetTokens: PasswordResetTokenDto[]
  declare schools: SchoolDto[]

  constructor(user?: User) {
    super()

    if (!user) return
    this.id = user.id
    this.firstName = user.firstName
    this.lastName = user.lastName
    this.email = user.email
    this.fullName = `${user.firstName} ${user.lastName ?? ''}`.trim()
    this.createdAt = user.createdAt.toISO()!
    this.updatedAt = user.updatedAt?.toISO() ?? null
    this.passwordResetTokens = PasswordResetTokenDto.fromArray(user.passwordResetTokens)
    this.schools = SchoolDto.fromArray(user.schools)
  }
}

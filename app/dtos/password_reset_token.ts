import { BaseModelDto } from '@adocasts.com/dto/base'
import PasswordResetToken from '#models/password_reset_token'
import UserDto from '#dtos/user'

export default class PasswordResetTokenDto extends BaseModelDto {
  declare id: string
  declare userId: string
  declare value: string
  declare expiresAt: string
  declare createdAt: string
  declare updatedAt: string
  declare user: UserDto | null

  constructor(passwordResetToken?: PasswordResetToken) {
    super()

    if (!passwordResetToken) return
    this.id = passwordResetToken.id
    this.userId = passwordResetToken.userId
    this.value = passwordResetToken.value
    this.expiresAt = passwordResetToken.expiresAt.toISO()!
    this.createdAt = passwordResetToken.createdAt.toISO()!
    this.updatedAt = passwordResetToken.updatedAt.toISO()!
    this.user = passwordResetToken.user && new UserDto(passwordResetToken.user)
  }
}

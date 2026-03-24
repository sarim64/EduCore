import PasswordResetToken from '#models/password_reset_token'
import encryption from '@adonisjs/core/services/encryption'

type Params = {
  encryptedValue: string
}

export default class VerifyPasswordResetToken {
  static async handle({ encryptedValue }: Params) {
    let value: unknown

    try {
      value = encryption.decrypt(encryptedValue)
    } catch {
      return { isValid: false, token: null, user: null }
    }

    if (!value) {
      return { isValid: false, token: null, user: null }
    }

    const token = await PasswordResetToken.findBy({ value })
    const user = await token?.related('user').query().first()

    return {
      isValid: token?.isValid,
      token,
      user,
    }
  }
}

import vine from '@vinejs/vine'

export const registerValidator = vine.compile(
  vine.object({
    firstName: vine.string().trim().minLength(2).maxLength(50),
    lastName: vine.string().trim().maxLength(50).optional(),
    email: vine
      .string()
      .maxLength(254)
      .email()
      .unique(async (db, value) => {
        const exists = await db.from('users').where('email', value).select('id').first()
        return !exists
      }),
    password: vine.string().minLength(8).confirmed({ confirmationField: 'passwordConfirmation' }),
  })
)

export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    password: vine.string(),
  })
)

export const forgotPasswordValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
  })
)

export const passwordResetValidator = vine.compile(
  vine.object({
    value: vine.string(),
    password: vine.string().minLength(8),
  })
)

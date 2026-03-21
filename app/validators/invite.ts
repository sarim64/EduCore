import vine from '@vinejs/vine'
import Roles from '#enums/roles'

export const sendInviteValidator = vine.compile(
  vine.object({
    email: vine.string().email().maxLength(254),
    roleId: vine.number().in([
      Roles.ACCOUNTANT,
      Roles.PRINCIPAL,
      Roles.VICE_PRINCIPAL,
      Roles.TEACHER,
      Roles.SUPPORT_STAFF,
    ]),
  })
)

export const acceptInviteValidator = vine.compile(
  vine.object({
    token: vine.string(),
    firstName: vine.string().trim().minLength(2).maxLength(50).optional(),
    lastName: vine.string().trim().maxLength(50).optional(),
    password: vine.string().minLength(8).optional(),
  })
)

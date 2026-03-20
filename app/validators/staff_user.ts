import vine from '@vinejs/vine'
import Roles from '#enums/roles'

export const linkUserValidator = vine.compile(
  vine.object({
    action: vine.enum(['create', 'link']),
    userId: vine.string().uuid().optional().requiredWhen('action', '=', 'link'),
    password: vine.string().maxLength(100).optional(),
    roleId: vine.number().min(Roles.SCHOOL_ADMIN).max(Roles.SUPPORT_STAFF).optional(),
  })
)

import vine from '@vinejs/vine'

export const schoolValidator = vine.compile(
  vine.object({
    name: vine.string().maxLength(200),
    code: vine.string().maxLength(30).optional(),
    address: vine.string().optional(),
    phone: vine.string().maxLength(20).optional(),
  })
)

export const selectSchoolValidator = vine.compile(
  vine.object({
    schoolId: vine.string().uuid(),
  })
)

import vine from '@vinejs/vine'

export const adminCreateSchoolValidator = vine.compile(
  vine.object({
    name: vine.string().trim().maxLength(200),
    code: vine.string().trim().maxLength(30).optional(),
    address: vine.string().trim().optional(),
    phone: vine.string().trim().maxLength(20).optional(),
    adminEmail: vine.string().email().maxLength(254).optional(),
    adminFirstName: vine.string().trim().maxLength(100).optional(),
    adminLastName: vine.string().trim().maxLength(100).optional(),
  })
)

export const adminUpdateSchoolValidator = vine.compile(
  vine.object({
    name: vine.string().trim().maxLength(200).optional(),
    code: vine.string().trim().maxLength(30).optional(),
    address: vine.string().trim().optional(),
    phone: vine.string().trim().maxLength(20).optional(),
  })
)

export const addSchoolAdminValidator = vine.compile(
  vine.object({
    email: vine.string().email().maxLength(254),
    firstName: vine.string().trim().maxLength(100),
    lastName: vine.string().trim().maxLength(100).optional(),
    password: vine.string().minLength(8).maxLength(100).optional(),
  })
)


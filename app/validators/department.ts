import vine from '@vinejs/vine'

export const createDepartmentValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1).maxLength(100),
    description: vine.string().trim().maxLength(500).optional(),
    isActive: vine.boolean().optional(),
  })
)

export const updateDepartmentValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1).maxLength(100).optional(),
    description: vine.string().trim().maxLength(500).optional(),
    isActive: vine.boolean().optional(),
    headId: vine.string().uuid().optional(),
  })
)

import vine from '@vinejs/vine'

export const createDesignationValidator = vine.compile(
  vine.object({
    departmentId: vine.string().uuid(),
    name: vine.string().trim().minLength(1).maxLength(100),
    description: vine.string().trim().maxLength(500).optional(),
    isActive: vine.boolean().optional(),
  })
)

export const updateDesignationValidator = vine.compile(
  vine.object({
    departmentId: vine.string().uuid().optional(),
    name: vine.string().trim().minLength(1).maxLength(100).optional(),
    description: vine.string().trim().maxLength(500).optional(),
    isActive: vine.boolean().optional(),
  })
)

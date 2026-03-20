import vine from '@vinejs/vine'

export const createFeeCategoryValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1).maxLength(100),
    code: vine.string().trim().maxLength(20).optional(),
    description: vine.string().trim().maxLength(500).optional(),
    incomeAccountId: vine.string().uuid().optional(),
    isMandatory: vine.boolean().optional(),
    isActive: vine.boolean().optional(),
    displayOrder: vine.number().min(0).optional(),
  })
)

export const updateFeeCategoryValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1).maxLength(100).optional(),
    code: vine.string().trim().maxLength(20).optional(),
    description: vine.string().trim().maxLength(500).optional(),
    incomeAccountId: vine.string().uuid().nullable().optional(),
    isMandatory: vine.boolean().optional(),
    isActive: vine.boolean().optional(),
    displayOrder: vine.number().min(0).optional(),
  })
)

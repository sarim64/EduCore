import vine from '@vinejs/vine'

export const createFeeDiscountValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1).maxLength(100),
    code: vine.string().trim().maxLength(20).optional(),
    description: vine.string().trim().maxLength(500).optional(),
    feeCategoryId: vine.string().uuid().optional(),
    discountType: vine.enum(['percentage', 'fixed']),
    value: vine.number().positive(),
    criteria: vine.string().trim().maxLength(50).optional(),
    maxBeneficiaries: vine.number().min(1).optional(),
    validFrom: vine.date().optional(),
    validUntil: vine.date().optional(),
    isActive: vine.boolean().optional(),
  })
)

export const updateFeeDiscountValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1).maxLength(100).optional(),
    code: vine.string().trim().maxLength(20).optional(),
    description: vine.string().trim().maxLength(500).optional(),
    feeCategoryId: vine.string().uuid().nullable().optional(),
    discountType: vine.enum(['percentage', 'fixed']).optional(),
    value: vine.number().positive().optional(),
    criteria: vine.string().trim().maxLength(50).optional(),
    maxBeneficiaries: vine.number().min(1).nullable().optional(),
    validFrom: vine.date().nullable().optional(),
    validUntil: vine.date().nullable().optional(),
    isActive: vine.boolean().optional(),
  })
)

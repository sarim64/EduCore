import vine from '@vinejs/vine'

export const createPlanValidator = vine.compile(
  vine.object({
    name: vine.string().trim().maxLength(100),
    code: vine.string().trim().maxLength(50),
    description: vine.string().trim().optional(),
    priceMonthly: vine.number().min(0).optional(),
    priceYearly: vine.number().min(0).optional(),
    maxStudents: vine.number().optional(),
    maxStaff: vine.number().optional(),
    isActive: vine.boolean().optional(),
  })
)

export const updatePlanValidator = vine.compile(
  vine.object({
    name: vine.string().trim().maxLength(100).optional(),
    code: vine.string().trim().maxLength(50).optional(),
    description: vine.string().trim().optional(),
    priceMonthly: vine.number().min(0).optional(),
    priceYearly: vine.number().min(0).optional(),
    maxStudents: vine.number().optional(),
    maxStaff: vine.number().optional(),
    isActive: vine.boolean().optional(),
  })
)

export const assignSubscriptionValidator = vine.compile(
  vine.object({
    planId: vine.string().uuid(),
    startDate: vine.date(),
    endDate: vine.date().optional(),
    maxStudents: vine.number().optional(),
    maxStaff: vine.number().optional(),
    customPrice: vine.number().min(0).optional(),
    notes: vine.string().trim().maxLength(500).optional(),
  })
)

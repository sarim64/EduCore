import vine from '@vinejs/vine'

export const createLeaveTypeValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2).maxLength(100),
    code: vine.string().trim().minLength(1).maxLength(20),
    description: vine.string().trim().maxLength(500).optional(),
    allowedDays: vine.number().min(0).max(365).optional(),
    isPaid: vine.boolean().optional(),
    isActive: vine.boolean().optional(),
    appliesTo: vine.enum(['all', 'teaching', 'non_teaching']).optional(),
  })
)

export const updateLeaveTypeValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2).maxLength(100).optional(),
    code: vine.string().trim().minLength(1).maxLength(20).optional(),
    description: vine.string().trim().maxLength(500).optional().nullable(),
    allowedDays: vine.number().min(0).max(365).optional(),
    isPaid: vine.boolean().optional(),
    isActive: vine.boolean().optional(),
    appliesTo: vine.enum(['all', 'teaching', 'non_teaching']).optional(),
  })
)

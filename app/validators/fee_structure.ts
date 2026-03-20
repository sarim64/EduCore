import vine from '@vinejs/vine'

export const createFeeStructureValidator = vine.compile(
  vine.object({
    academicYearId: vine.string().uuid(),
    classId: vine.string().uuid(),
    feeCategoryId: vine.string().uuid(),
    amount: vine.number().positive(),
    frequency: vine.enum(['monthly', 'quarterly', 'half_yearly', 'yearly', 'one_time']),
    lateFeeAmount: vine.number().min(0).optional(),
    lateFeePercentage: vine.number().min(0).max(100).optional(),
    gracePeriodDays: vine.number().min(0).optional(),
    dueDayOfMonth: vine.number().min(1).max(28).optional(),
    isActive: vine.boolean().optional(),
  })
)

export const updateFeeStructureValidator = vine.compile(
  vine.object({
    amount: vine.number().positive().optional(),
    frequency: vine.enum(['monthly', 'quarterly', 'half_yearly', 'yearly', 'one_time']).optional(),
    lateFeeAmount: vine.number().min(0).optional(),
    lateFeePercentage: vine.number().min(0).max(100).optional(),
    gracePeriodDays: vine.number().min(0).optional(),
    dueDayOfMonth: vine.number().min(1).max(28).optional(),
    isActive: vine.boolean().optional(),
  })
)

export const bulkCreateFeeStructureValidator = vine.compile(
  vine.object({
    academicYearId: vine.string().uuid(),
    classIds: vine.array(vine.string().uuid()).minLength(1),
    structures: vine
      .array(
        vine.object({
          feeCategoryId: vine.string().uuid(),
          amount: vine.number().positive(),
          frequency: vine.enum(['monthly', 'quarterly', 'half_yearly', 'yearly', 'one_time']),
          lateFeeAmount: vine.number().min(0).optional(),
          lateFeePercentage: vine.number().min(0).max(100).optional(),
          gracePeriodDays: vine.number().min(0).optional(),
          dueDayOfMonth: vine.number().min(1).max(28).optional(),
        })
      )
      .minLength(1),
  })
)

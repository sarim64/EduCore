import vine from '@vinejs/vine'

export const createStudentDiscountValidator = vine.compile(
  vine.object({
    studentId: vine.string().uuid(),
    feeDiscountId: vine.string().uuid(),
    academicYearId: vine.string().uuid(),
    overrideDiscountType: vine.enum(['percentage', 'fixed']).optional(),
    overrideValue: vine.number().positive().optional(),
    remarks: vine.string().trim().maxLength(500).optional(),
    isActive: vine.boolean().optional(),
  })
)

export const updateStudentDiscountValidator = vine.compile(
  vine.object({
    overrideDiscountType: vine.enum(['percentage', 'fixed']).nullable().optional(),
    overrideValue: vine.number().positive().nullable().optional(),
    remarks: vine.string().trim().maxLength(500).optional(),
    isActive: vine.boolean().optional(),
  })
)

export const bulkAssignStudentDiscountValidator = vine.compile(
  vine.object({
    studentIds: vine.array(vine.string().uuid()).minLength(1),
    feeDiscountId: vine.string().uuid(),
    academicYearId: vine.string().uuid(),
    remarks: vine.string().trim().maxLength(500).optional(),
  })
)

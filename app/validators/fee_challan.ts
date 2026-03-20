import vine from '@vinejs/vine'

export const generateChallanValidator = vine.compile(
  vine.object({
    studentId: vine.string().uuid(),
    academicYearId: vine.string().uuid(),
    period: vine.string().trim().minLength(1).maxLength(20), // e.g., "2024-01", "2024-Q1"
    issueDate: vine.date(),
    dueDate: vine.date(),
    remarks: vine.string().trim().maxLength(500).optional(),
  })
)

export const bulkGenerateChallanValidator = vine.compile(
  vine.object({
    academicYearId: vine.string().uuid(),
    classId: vine.string().uuid().optional(), // if not specified, all classes
    sectionId: vine.string().uuid().optional(), // if not specified, all sections
    period: vine.string().trim().minLength(1).maxLength(20),
    issueDate: vine.date(),
    dueDate: vine.date(),
  })
)

export const updateChallanValidator = vine.compile(
  vine.object({
    dueDate: vine.date().optional(),
    remarks: vine.string().trim().maxLength(500).optional(),
    status: vine.enum(['pending', 'partial', 'paid', 'cancelled', 'overdue']).optional(),
  })
)

export const addChallanItemValidator = vine.compile(
  vine.object({
    feeCategoryId: vine.string().uuid(),
    amount: vine.number().positive(),
    discountAmount: vine.number().min(0).optional(),
    description: vine.string().trim().maxLength(255).optional(),
  })
)

export const applyLateFeeValidator = vine.compile(
  vine.object({
    challanIds: vine.array(vine.string().uuid()).minLength(1).optional(), // if not specified, applies to all overdue challans
    asOfDate: vine.date().optional(), // defaults to today
  })
)

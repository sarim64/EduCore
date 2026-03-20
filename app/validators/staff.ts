import vine from '@vinejs/vine'

export const createStaffValidator = vine.compile(
  vine.object({
    departmentId: vine.string().uuid().optional(),
    designationId: vine.string().uuid().optional(),
    firstName: vine.string().trim().minLength(1).maxLength(100),
    lastName: vine.string().trim().maxLength(100).optional(),
    dateOfBirth: vine.date().optional(),
    gender: vine.string().trim().maxLength(10).optional(),
    bloodGroup: vine.string().trim().maxLength(5).optional(),
    maritalStatus: vine.string().trim().maxLength(20).optional(),
    nationality: vine.string().trim().maxLength(50).optional(),
    nationalId: vine
      .string()
      .trim()
      .maxLength(50)
      .unique(async (db, value, field) => {
        if (!value) return true
        const schoolId = field.meta.schoolId
        const exists = await db
          .from('staff_members')
          .where('school_id', schoolId)
          .where('national_id', value)
          .first()
        return !exists
      })
      .optional(),
    email: vine
      .string()
      .email()
      .maxLength(254)
      .unique(async (db, value, field) => {
        if (!value) return true
        const schoolId = field.meta.schoolId
        const exists = await db
          .from('staff_members')
          .where('school_id', schoolId)
          .where('email', value)
          .first()
        return !exists
      })
      .optional(),
    phone: vine.string().trim().maxLength(20).optional(),
    alternatePhone: vine.string().trim().maxLength(20).optional(),
    address: vine.string().trim().maxLength(500).optional(),
    city: vine.string().trim().maxLength(100).optional(),
    state: vine.string().trim().maxLength(100).optional(),
    postalCode: vine.string().trim().maxLength(20).optional(),
    country: vine.string().trim().maxLength(100).optional(),
    emergencyContactName: vine.string().trim().maxLength(100).optional(),
    emergencyContactPhone: vine.string().trim().maxLength(20).optional(),
    emergencyContactRelation: vine.string().trim().maxLength(50).optional(),
    joiningDate: vine.date().optional(),
    employmentType: vine.string().trim().maxLength(20),
    basicSalary: vine.number().min(0),
    bankName: vine.string().trim().maxLength(100).optional(),
    bankAccountNumber: vine.string().trim().maxLength(50).optional(),
    status: vine.string().trim().maxLength(20),
  })
)

export const updateStaffValidator = vine.compile(
  vine.object({
    departmentId: vine.string().uuid().optional().nullable(),
    designationId: vine.string().uuid().optional().nullable(),
    firstName: vine.string().trim().minLength(1).maxLength(100).optional(),
    lastName: vine.string().trim().maxLength(100).optional().nullable(),
    dateOfBirth: vine.date().optional().nullable(),
    gender: vine.string().trim().maxLength(10).optional().nullable(),
    bloodGroup: vine.string().trim().maxLength(5).optional().nullable(),
    maritalStatus: vine.string().trim().maxLength(20).optional().nullable(),
    nationality: vine.string().trim().maxLength(50).optional().nullable(),
    nationalId: vine
      .string()
      .trim()
      .maxLength(50)
      .unique(async (db, value, field) => {
        if (!value) return true
        const { schoolId, staffId } = field.meta
        const exists = await db
          .from('staff_members')
          .where('school_id', schoolId)
          .where('national_id', value)
          .whereNot('id', staffId)
          .first()
        return !exists
      })
      .optional()
      .nullable(),
    email: vine
      .string()
      .email()
      .maxLength(254)
      .unique(async (db, value, field) => {
        if (!value) return true
        const { schoolId, staffId } = field.meta
        const exists = await db
          .from('staff_members')
          .where('school_id', schoolId)
          .where('email', value)
          .whereNot('id', staffId)
          .first()
        return !exists
      })
      .optional()
      .nullable(),
    phone: vine.string().trim().maxLength(20).optional().nullable(),
    alternatePhone: vine.string().trim().maxLength(20).optional().nullable(),
    address: vine.string().trim().maxLength(500).optional().nullable(),
    city: vine.string().trim().maxLength(100).optional().nullable(),
    state: vine.string().trim().maxLength(100).optional().nullable(),
    postalCode: vine.string().trim().maxLength(20).optional().nullable(),
    country: vine.string().trim().maxLength(100).optional().nullable(),
    emergencyContactName: vine.string().trim().maxLength(100).optional().nullable(),
    emergencyContactPhone: vine.string().trim().maxLength(20).optional().nullable(),
    emergencyContactRelation: vine.string().trim().maxLength(50).optional().nullable(),
    joiningDate: vine.date().optional().nullable(),
    employmentType: vine.string().trim().maxLength(20).optional(),
    basicSalary: vine.number().min(0).optional(),
    bankName: vine.string().trim().maxLength(100).optional().nullable(),
    bankAccountNumber: vine.string().trim().maxLength(50).optional().nullable(),
    status: vine.string().trim().maxLength(20).optional(),
  })
)

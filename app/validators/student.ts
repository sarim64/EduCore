import vine from '@vinejs/vine'

export const createStudentValidator = vine.compile(
  vine.object({
    // Personal Information
    firstName: vine.string().trim().minLength(2).maxLength(100),
    lastName: vine.string().trim().maxLength(100).optional(),
    dateOfBirth: vine.date().optional(),
    gender: vine.string().trim().maxLength(10).optional(),
    bloodGroup: vine.string().trim().maxLength(5).optional(),
    religion: vine.string().trim().maxLength(50).optional(),
    nationality: vine.string().trim().maxLength(50).optional(),

    // Contact Information
    email: vine.string().email().maxLength(254).optional(),
    phone: vine.string().trim().maxLength(20).optional(),
    address: vine.string().trim().optional(),
    city: vine.string().trim().maxLength(100).optional(),
    state: vine.string().trim().maxLength(100).optional(),
    postalCode: vine.string().trim().maxLength(20).optional(),
    country: vine.string().trim().maxLength(100).optional(),

    // Medical Information
    medicalConditions: vine.string().trim().optional(),
    allergies: vine.string().trim().optional(),
    emergencyContactName: vine.string().trim().maxLength(100).optional(),
    emergencyContactPhone: vine.string().trim().maxLength(20).optional(),

    // Academic Information
    admissionDate: vine.date().optional(),
    previousSchool: vine.string().trim().maxLength(200).optional(),
  })
)

export const updateStudentValidator = vine.compile(
  vine.object({
    // Personal Information
    firstName: vine.string().trim().minLength(2).maxLength(100).optional(),
    lastName: vine.string().trim().maxLength(100).optional(),
    dateOfBirth: vine.date().optional(),
    gender: vine.string().trim().maxLength(10).optional(),
    bloodGroup: vine.string().trim().maxLength(5).optional(),
    religion: vine.string().trim().maxLength(50).optional(),
    nationality: vine.string().trim().maxLength(50).optional(),

    // Contact Information
    email: vine.string().email().maxLength(254).optional(),
    phone: vine.string().trim().maxLength(20).optional(),
    address: vine.string().trim().optional(),
    city: vine.string().trim().maxLength(100).optional(),
    state: vine.string().trim().maxLength(100).optional(),
    postalCode: vine.string().trim().maxLength(20).optional(),
    country: vine.string().trim().maxLength(100).optional(),

    // Medical Information
    medicalConditions: vine.string().trim().optional(),
    allergies: vine.string().trim().optional(),
    emergencyContactName: vine.string().trim().maxLength(100).optional(),
    emergencyContactPhone: vine.string().trim().maxLength(20).optional(),

    // Academic Information
    admissionDate: vine.date().optional(),
    previousSchool: vine.string().trim().maxLength(200).optional(),

    // Status
    status: vine.string().trim().maxLength(20).optional(),
  })
)

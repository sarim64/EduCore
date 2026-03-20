import vine from '@vinejs/vine'

export const createGuardianValidator = vine.compile(
  vine.object({
    // Personal Information
    firstName: vine.string().trim().minLength(2).maxLength(100),
    lastName: vine.string().trim().maxLength(100).optional(),
    relation: vine.string().trim().minLength(2).maxLength(50),

    // Contact Information
    email: vine.string().email().maxLength(254).optional(),
    phone: vine.string().trim().minLength(5).maxLength(20),
    alternatePhone: vine.string().trim().maxLength(20).optional(),
    address: vine.string().trim().optional(),
    city: vine.string().trim().maxLength(100).optional(),
    state: vine.string().trim().maxLength(100).optional(),
    postalCode: vine.string().trim().maxLength(20).optional(),
    country: vine.string().trim().maxLength(100).optional(),

    // Professional Information
    occupation: vine.string().trim().maxLength(100).optional(),
    workplace: vine.string().trim().maxLength(200).optional(),
    workPhone: vine.string().trim().maxLength(20).optional(),

    // Identification
    nationalId: vine.string().trim().maxLength(50).optional(),
  })
)

export const updateGuardianValidator = vine.compile(
  vine.object({
    firstName: vine.string().trim().minLength(2).maxLength(100).optional(),
    lastName: vine.string().trim().maxLength(100).optional(),
    relation: vine.string().trim().minLength(2).maxLength(50).optional(),
    email: vine.string().email().maxLength(254).optional(),
    phone: vine.string().trim().minLength(5).maxLength(20).optional(),
    alternatePhone: vine.string().trim().maxLength(20).optional(),
    address: vine.string().trim().optional(),
    city: vine.string().trim().maxLength(100).optional(),
    state: vine.string().trim().maxLength(100).optional(),
    postalCode: vine.string().trim().maxLength(20).optional(),
    country: vine.string().trim().maxLength(100).optional(),
    occupation: vine.string().trim().maxLength(100).optional(),
    workplace: vine.string().trim().maxLength(200).optional(),
    workPhone: vine.string().trim().maxLength(20).optional(),
    nationalId: vine.string().trim().maxLength(50).optional(),
  })
)

export const attachGuardianValidator = vine.compile(
  vine.object({
    guardianId: vine.string().uuid(),
    isPrimary: vine.boolean().optional(),
    isEmergencyContact: vine.boolean().optional(),
    canPickup: vine.boolean().optional(),
  })
)

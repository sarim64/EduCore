import vine from '@vinejs/vine'

export const createStaffQualificationValidator = vine.compile(
  vine.object({
    degree: vine.string().trim().minLength(2).maxLength(100),
    fieldOfStudy: vine.string().trim().maxLength(200).optional(),
    institution: vine.string().trim().minLength(2).maxLength(200),
    year: vine.number().min(1950).max(new Date().getFullYear()),
    grade: vine.string().trim().maxLength(20).optional(),
    certificateUrl: vine.string().trim().url().optional(),
  })
)

export const updateStaffQualificationValidator = vine.compile(
  vine.object({
    degree: vine.string().trim().minLength(2).maxLength(100).optional(),
    fieldOfStudy: vine.string().trim().maxLength(200).nullable().optional(),
    institution: vine.string().trim().minLength(2).maxLength(200).optional(),
    year: vine.number().min(1950).max(new Date().getFullYear()).optional(),
    grade: vine.string().trim().maxLength(20).nullable().optional(),
    certificateUrl: vine.string().trim().url().nullable().optional(),
  })
)

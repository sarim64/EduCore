import vine from '@vinejs/vine'

export const createStaffDocumentValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2).maxLength(100),
    type: vine.enum(['identity', 'educational', 'experience', 'medical', 'other']),
    fileUrl: vine.string().trim().maxLength(500),
    fileType: vine.string().trim().maxLength(50).optional(),
    fileSize: vine.number().min(0).optional(),
    notes: vine.string().trim().maxLength(500).optional(),
  })
)

export const updateStaffDocumentValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2).maxLength(100).optional(),
    type: vine.enum(['identity', 'educational', 'experience', 'medical', 'other']).optional(),
    fileUrl: vine.string().trim().maxLength(500).optional(),
    fileType: vine.string().trim().maxLength(50).nullable().optional(),
    fileSize: vine.number().min(0).nullable().optional(),
    notes: vine.string().trim().maxLength(500).nullable().optional(),
  })
)

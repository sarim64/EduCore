import vine from '@vinejs/vine'

export const createSectionValidator = vine.compile(
  vine.object({
    classId: vine
      .string()
      .uuid()
      .exists(async (database, value, field) => {
        const schoolId = field.meta.schoolId
        const classExists = await database
          .from('classes')
          .where('id', value)
          .where('school_id', schoolId)
          .first()
        return !!classExists
      }),
    name: vine.string().trim().minLength(1).maxLength(20),
    capacity: vine.number().min(1).max(200).optional(),
    roomNumber: vine.string().trim().maxLength(20).optional(),
  })
)

export const updateSectionValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1).maxLength(20).optional(),
    capacity: vine.number().min(1).max(200).optional(),
    roomNumber: vine.string().trim().maxLength(20).optional(),
  })
)

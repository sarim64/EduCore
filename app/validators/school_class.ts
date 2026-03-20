import vine from '@vinejs/vine'

export const createClassValidator = vine.compile(
  vine.object({
    name: vine
      .string()
      .trim()
      .minLength(1)
      .maxLength(50)
      .unique(async (db, value, field) => {
        const schoolId = field.meta.schoolId
        const exists = await db
          .from('classes')
          .where('name', value)
          .where('school_id', schoolId)
          .first()
        return !exists
      }),
    code: vine
      .string()
      .trim()
      .maxLength(20)
      .unique(async (db, value, field) => {
        if (!value) return true
        const schoolId = field.meta.schoolId
        const exists = await db
          .from('classes')
          .where('code', value)
          .where('school_id', schoolId)
          .first()
        return !exists
      })
      .optional(),
    displayOrder: vine.number().min(0).optional(),
    description: vine.string().optional(),
  })
)

export const updateClassValidator = vine.compile(
  vine.object({
    name: vine
      .string()
      .trim()
      .minLength(1)
      .maxLength(50)
      .unique(async (db, value, field) => {
        if (!value) return true
        const { schoolId, classId } = field.meta
        const exists = await db
          .from('classes')
          .where('name', value)
          .where('school_id', schoolId)
          .whereNot('id', classId)
          .first()
        return !exists
      })
      .optional(),
    code: vine
      .string()
      .trim()
      .maxLength(20)
      .unique(async (db, value, field) => {
        if (!value) return true
        const { schoolId, classId } = field.meta
        const exists = await db
          .from('classes')
          .where('code', value)
          .where('school_id', schoolId)
          .whereNot('id', classId)
          .first()
        return !exists
      })
      .optional(),
    displayOrder: vine.number().min(0).optional(),
    description: vine.string().optional(),
  })
)

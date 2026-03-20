import vine from '@vinejs/vine'

export const createSubjectValidator = vine.compile(
  vine.object({
    name: vine
      .string()
      .trim()
      .minLength(1)
      .maxLength(100)
      .unique(async (db, value, field) => {
        const schoolId = field.meta.schoolId
        const exists = await db
          .from('subjects')
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
          .from('subjects')
          .where('code', value)
          .where('school_id', schoolId)
          .first()
        return !exists
      })
      .optional(),
    description: vine.string().optional(),
    isElective: vine.boolean().optional(),
  })
)

export const updateSubjectValidator = vine.compile(
  vine.object({
    name: vine
      .string()
      .trim()
      .minLength(1)
      .maxLength(100)
      .unique(async (db, value, field) => {
        if (!value) return true
        const { schoolId, subjectId } = field.meta
        const exists = await db
          .from('subjects')
          .where('name', value)
          .where('school_id', schoolId)
          .whereNot('id', subjectId)
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
        const { schoolId, subjectId } = field.meta
        const exists = await db
          .from('subjects')
          .where('code', value)
          .where('school_id', schoolId)
          .whereNot('id', subjectId)
          .first()
        return !exists
      })
      .optional(),
    description: vine.string().optional(),
    isElective: vine.boolean().optional(),
  })
)

export const assignSubjectToClassValidator = vine.compile(
  vine.object({
    classId: vine.string().uuid(),
    subjectId: vine.string().uuid(),
    periodsPerWeek: vine.number().min(1).max(20).optional(),
    isMandatory: vine.boolean().optional(),
  })
)

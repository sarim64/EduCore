import vine from '@vinejs/vine'

export const createAcademicYearValidator = vine.compile(
  vine.object({
    name: vine
      .string()
      .trim()
      .minLength(2)
      .maxLength(50)
      .unique(async (db, value, field) => {
        const schoolId = field.meta.schoolId
        const exists = await db
          .from('academic_years')
          .where('name', value)
          .where('school_id', schoolId)
          .first()
        return !exists
      }),
    startDate: vine.date(),
    endDate: vine.date().afterField('startDate'),
    isCurrent: vine.boolean().optional(),
  })
)

export const updateAcademicYearValidator = vine.compile(
  vine.object({
    name: vine
      .string()
      .trim()
      .minLength(2)
      .maxLength(50)
      .unique(async (db, value, field) => {
        const { schoolId, academicYearId } = field.meta
        const exists = await db
          .from('academic_years')
          .where('name', value)
          .where('school_id', schoolId)
          .whereNot('id', academicYearId)
          .first()
        return !exists
      })
      .optional(),
    startDate: vine.date().optional(),
    endDate: vine.date().optional(),
    isCurrent: vine.boolean().optional(),
  })
)

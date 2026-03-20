import vine from '@vinejs/vine'

export const createTeacherAssignmentValidator = vine.compile(
  vine.object({
    staffMemberId: vine.string().uuid(),
    academicYearId: vine.string().uuid(),
    classId: vine.string().uuid(),
    sectionId: vine.string().uuid().optional(),
    subjectId: vine.string().uuid(),
    isClassTeacher: vine.boolean().optional(),
    notes: vine.string().trim().maxLength(500).optional(),
  })
)

export const updateTeacherAssignmentValidator = vine.compile(
  vine.object({
    staffMemberId: vine.string().uuid().optional(),
    academicYearId: vine.string().uuid().optional(),
    classId: vine.string().uuid().optional(),
    sectionId: vine.string().uuid().nullable().optional(),
    subjectId: vine.string().uuid().optional(),
    isClassTeacher: vine.boolean().optional(),
    notes: vine.string().trim().maxLength(500).nullable().optional(),
  })
)

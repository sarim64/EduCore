import vine from '@vinejs/vine'

export const markStudentAttendanceValidator = vine.compile(
  vine.object({
    studentId: vine.string().uuid(),
    academicYearId: vine.string().uuid(),
    classId: vine.string().uuid().optional(),
    sectionId: vine.string().uuid().optional(),
    date: vine.date({ formats: ['YYYY-MM-DD'] }),
    status: vine.enum(['present', 'absent', 'late', 'excused', 'half_day']),
    remarks: vine.string().trim().maxLength(500).optional(),
  })
)

export const bulkStudentAttendanceValidator = vine.compile(
  vine.object({
    classId: vine.string().uuid(),
    sectionId: vine.string().uuid().optional(),
    academicYearId: vine.string().uuid(),
    date: vine.date({ formats: ['YYYY-MM-DD'] }),
    attendances: vine.array(
      vine.object({
        studentId: vine.string().uuid(),
        status: vine.enum(['present', 'absent', 'late', 'excused', 'half_day']),
        remarks: vine.string().trim().maxLength(500).optional(),
      })
    ),
  })
)

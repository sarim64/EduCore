import vine from '@vinejs/vine'

export const markStaffAttendanceValidator = vine.compile(
  vine.object({
    staffMemberId: vine.string().uuid(),
    date: vine.date({ formats: ['YYYY-MM-DD'] }),
    status: vine.enum(['present', 'absent', 'late', 'on_leave', 'half_day']),
    checkInTime: vine
      .string()
      .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .optional(),
    checkOutTime: vine
      .string()
      .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .optional(),
    remarks: vine.string().trim().maxLength(500).optional(),
  })
)

export const bulkStaffAttendanceValidator = vine.compile(
  vine.object({
    date: vine.date({ formats: ['YYYY-MM-DD'] }),
    attendances: vine.array(
      vine.object({
        staffMemberId: vine.string().uuid(),
        status: vine.enum(['present', 'absent', 'late', 'on_leave', 'half_day']),
        checkInTime: vine
          .string()
          .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
          .optional(),
        checkOutTime: vine
          .string()
          .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
          .optional(),
        remarks: vine.string().trim().maxLength(500).optional(),
      })
    ),
  })
)

import vine from '@vinejs/vine'

export const applyLeaveValidator = vine.compile(
  vine.object({
    leaveTypeId: vine.string().uuid(),
    startDate: vine.date({ formats: ['YYYY-MM-DD'] }),
    endDate: vine.date({ formats: ['YYYY-MM-DD'] }),
    reason: vine.string().trim().minLength(10).maxLength(1000),
  })
)

export const processLeaveValidator = vine.compile(
  vine.object({
    reviewerRemarks: vine.string().trim().maxLength(500).optional(),
  })
)

import LeaveType from '#models/leave_type'
import { updateLeaveTypeValidator } from '#validators/leave_type'
import { Infer } from '@vinejs/vine/types'

type Params = {
  leaveTypeId: string
  schoolId: string
  data: Infer<typeof updateLeaveTypeValidator>
}

export default class UpdateLeaveType {
  static async handle({ leaveTypeId, schoolId, data }: Params) {
    const leaveType = await LeaveType.query()
      .where('id', leaveTypeId)
      .where('schoolId', schoolId)
      .firstOrFail()

    if (data.code && data.code !== leaveType.code) {
      const existing = await LeaveType.query()
        .where('schoolId', schoolId)
        .where('code', data.code)
        .whereNot('id', leaveTypeId)
        .first()

      if (existing) {
        const e = new Error('Leave type code already exists') as any
        e.code = 'E_DUPLICATE_LEAVE_TYPE_CODE'
        throw e
      }
    }

    leaveType.merge(data)
    await leaveType.save()

    return leaveType
  }
}

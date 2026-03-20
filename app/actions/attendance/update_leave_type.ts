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

    leaveType.merge(data)
    await leaveType.save()

    return leaveType
  }
}

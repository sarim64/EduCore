import LeaveType from '#models/leave_type'

type Params = {
  leaveTypeId: string
  schoolId: string
}

export default class DeleteLeaveType {
  static async handle({ leaveTypeId, schoolId }: Params) {
    const leaveType = await LeaveType.query()
      .where('id', leaveTypeId)
      .where('schoolId', schoolId)
      .firstOrFail()

    await leaveType.delete()

    return leaveType
  }
}

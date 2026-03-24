import LeaveType from '#models/leave_type'

type Params = {
  leaveTypeId: string
  schoolId: string
}

export default class GetLeaveType {
  static async handle({ leaveTypeId, schoolId }: Params) {
    return LeaveType.query().where('id', leaveTypeId).where('schoolId', schoolId).firstOrFail()
  }
}

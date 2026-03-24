import LeaveType from '#models/leave_type'

type Params = {
  schoolId: string
}

export default class ListLeaveTypes {
  static async handle({ schoolId }: Params) {
    return LeaveType.query().where('schoolId', schoolId).orderBy('name', 'asc')
  }
}

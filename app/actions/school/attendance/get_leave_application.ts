import LeaveApplication from '#models/leave_application'

type Params = {
  leaveApplicationId: string
  schoolId: string
}

export default class GetLeaveApplication {
  static async handle({ leaveApplicationId, schoolId }: Params) {
    return LeaveApplication.query()
      .where('id', leaveApplicationId)
      .where('schoolId', schoolId)
      .preload('staffMember', (staffQuery) => {
        staffQuery.preload('department').preload('designation')
      })
      .preload('leaveType')
      .firstOrFail()
  }
}

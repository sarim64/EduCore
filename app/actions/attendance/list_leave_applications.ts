import LeaveApplication from '#models/leave_application'

type Params = {
  schoolId: string
  staffMemberId?: string
  status?: string
}

export default class ListLeaveApplications {
  static async handle({ schoolId, staffMemberId, status }: Params) {
    let query = LeaveApplication.query()
      .where('schoolId', schoolId)
      .preload('staffMember', (staffQuery) => {
        staffQuery.preload('department').preload('designation')
      })
      .preload('leaveType')

    if (staffMemberId) {
      query = query.where('staffMemberId', staffMemberId)
    }

    if (status) {
      query = query.where('status', status)
    }

    return query.orderBy('createdAt', 'desc')
  }
}

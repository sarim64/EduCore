import Staff from '#models/staff_member'
import StaffAttendance from '#models/staff_attendance'

type Params = {
  staffId: string
  schoolId: string
}

export default class GetStaffAttendanceHistory {
  static async handle({ staffId, schoolId }: Params) {
    const [staff, attendances] = await Promise.all([
      Staff.query().where('id', staffId).where('schoolId', schoolId).firstOrFail(),
      StaffAttendance.query()
        .where('schoolId', schoolId)
        .where('staffMemberId', staffId)
        .orderBy('date', 'desc')
        .limit(100),
    ])

    return { staff, attendances }
  }
}

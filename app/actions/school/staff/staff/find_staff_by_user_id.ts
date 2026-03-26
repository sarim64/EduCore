import Staff from '#models/staff_member'

export default class FindStaffByUserId {
  static async handle(userId: string, schoolId: string) {
    return Staff.query().where('userId', userId).where('schoolId', schoolId).first()
  }
}

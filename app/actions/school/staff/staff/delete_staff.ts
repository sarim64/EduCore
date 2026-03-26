import GetStaff from '#actions/school/staff/staff/get_staff'

export default class DeleteStaff {
  static async handle(staffMemberId: string, schoolId: string): Promise<void> {
    const staff = await GetStaff.handle({ staffMemberId, schoolId })
    await staff.delete()
  }
}

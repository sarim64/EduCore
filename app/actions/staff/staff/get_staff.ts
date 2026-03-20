import Staff from '#models/staff_member'

type Params = {
  staffMemberId: string
  schoolId: string
}

export default class GetStaff {
  static async handle({ staffMemberId, schoolId }: Params) {
    return Staff.query()
      .where('id', staffMemberId)
      .where('schoolId', schoolId)
      .preload('department')
      .preload('designation')
      .preload('user')
      .preload('qualifications')
      .preload('documents')
      .firstOrFail()
  }
}

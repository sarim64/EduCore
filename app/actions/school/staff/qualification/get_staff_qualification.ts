import StaffQualification from '#models/staff_qualification'

type Params = {
  qualificationId: string
  staffMemberId: string
}

export default class GetStaffQualification {
  static async handle({ qualificationId, staffMemberId }: Params) {
    return StaffQualification.query()
      .where('id', qualificationId)
      .where('staffMemberId', staffMemberId)
      .firstOrFail()
  }
}

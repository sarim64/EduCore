import StaffQualification from '#models/staff_qualification'

type Params = {
  qualificationId: string
  staffMemberId: string
}

export default class DeleteStaffQualification {
  static async handle({ qualificationId, staffMemberId }: Params) {
    const qualification = await StaffQualification.query()
      .where('id', qualificationId)
      .where('staffMemberId', staffMemberId)
      .firstOrFail()

    await qualification.delete()
  }
}

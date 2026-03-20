import StaffQualification from '#models/staff_qualification'
import { updateStaffQualificationValidator } from '#validators/staff_qualification'
import { Infer } from '@vinejs/vine/types'

type Params = {
  qualificationId: string
  staffMemberId: string
  data: Infer<typeof updateStaffQualificationValidator>
}

export default class UpdateStaffQualification {
  static async handle({ qualificationId, staffMemberId, data }: Params) {
    const qualification = await StaffQualification.query()
      .where('id', qualificationId)
      .where('staffMemberId', staffMemberId)
      .firstOrFail()

    qualification.merge(data)
    await qualification.save()

    return qualification
  }
}

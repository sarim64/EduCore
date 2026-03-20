import StaffQualification from '#models/staff_qualification'
import { createStaffQualificationValidator } from '#validators/staff_qualification'
import { Infer } from '@vinejs/vine/types'

type Params = {
  staffMemberId: string
  data: Infer<typeof createStaffQualificationValidator>
}

export default class StoreStaffQualification {
  static async handle({ staffMemberId, data }: Params) {
    return StaffQualification.create({
      staffMemberId,
      ...data,
    })
  }
}

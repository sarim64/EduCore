import Staff from '#models/staff_member'
import { updateStaffValidator } from '#validators/staff'
import { Infer } from '@vinejs/vine/types'
import { DateTime } from 'luxon'

type Params = {
  staffMemberId: string
  schoolId: string
  data: Infer<typeof updateStaffValidator>
}

export default class UpdateStaff {
  static async handle({ staffMemberId, schoolId, data }: Params) {
    const staff = await Staff.query()
      .where('id', staffMemberId)
      .where('schoolId', schoolId)
      .firstOrFail()

    staff.merge({
      ...data,
      dateOfBirth: data.dateOfBirth ? DateTime.fromJSDate(data.dateOfBirth) : staff.dateOfBirth,
      joiningDate: data.joiningDate ? DateTime.fromJSDate(data.joiningDate) : staff.joiningDate,
    })

    await staff.save()

    return staff
  }
}

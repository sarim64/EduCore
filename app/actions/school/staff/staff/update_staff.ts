import Staff from '#models/staff_member'
import { updateStaffValidator } from '#validators/staff'
import { Infer } from '@vinejs/vine/types'
import { DateTime } from 'luxon'
import AuditService from '#services/audit_service'
import type { HttpContext } from '@adonisjs/core/http'

type Params = {
  staffMemberId: string
  schoolId: string
  data: Infer<typeof updateStaffValidator>
  ctx: HttpContext
  userId: string
}

export default class UpdateStaff {
  static async handle({ staffMemberId, schoolId, data, ctx, userId }: Params) {
    const staff = await Staff.query()
      .where('id', staffMemberId)
      .where('schoolId', schoolId)
      .firstOrFail()

    const oldValues = { firstName: staff.firstName, lastName: staff.lastName, email: staff.email, phone: staff.phone, departmentId: staff.departmentId, designationId: staff.designationId }

    staff.merge({
      ...data,
      dateOfBirth: data.dateOfBirth ? DateTime.fromJSDate(data.dateOfBirth) : staff.dateOfBirth,
      joiningDate: data.joiningDate ? DateTime.fromJSDate(data.joiningDate) : staff.joiningDate,
    })

    await staff.save()

    await AuditService.logUpdate(
      'Staff',
      staff.id,
      oldValues,
      { firstName: staff.firstName, lastName: staff.lastName, email: staff.email, phone: staff.phone, departmentId: staff.departmentId, designationId: staff.designationId },
      ctx,
      schoolId,
      userId
    )

    return staff
  }
}

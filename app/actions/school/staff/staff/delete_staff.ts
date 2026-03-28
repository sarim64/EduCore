import GetStaff from '#actions/school/staff/staff/get_staff'
import AuditService from '#services/audit_service'
import type { HttpContext } from '@adonisjs/core/http'

type Params = {
  staffMemberId: string
  schoolId: string
  ctx: HttpContext
  userId: string
}

export default class DeleteStaff {
  static async handle({ staffMemberId, schoolId, ctx, userId }: Params): Promise<void> {
    const staff = await GetStaff.handle({ staffMemberId, schoolId })
    const oldValues = { firstName: staff.firstName, lastName: staff.lastName, staffMemberId: staff.staffMemberId, email: staff.email }

    await staff.delete()

    await AuditService.logDelete('Staff', staffMemberId, oldValues, ctx, schoolId, userId)
  }
}

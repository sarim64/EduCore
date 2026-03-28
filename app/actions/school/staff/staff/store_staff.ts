import Staff from '#models/staff_member'
import User from '#models/user'
import { createStaffValidator } from '#validators/staff'
import { Infer } from '@vinejs/vine/types'
import { DateTime } from 'luxon'
import db from '@adonisjs/lucid/services/db'
import SubscriptionLimitService from '#services/subscription_limit_service'
import AuditService from '#services/audit_service'
import type { HttpContext } from '@adonisjs/core/http'

type Params = {
  schoolId: string
  data: Infer<typeof createStaffValidator>
  ctx: HttpContext
  userId: string
}

export default class StoreStaff {
  static async handle({ schoolId, data, ctx, userId }: Params) {
    await SubscriptionLimitService.assertCanAddStaff(schoolId, 1)

    const staffMemberId = await this.#generateStaffId(schoolId)
    let linkedUserId: string | undefined

    // Auto-link when email belongs to an existing user that is already in this school.
    if (data.email) {
      const existingUser = await User.query().where('email', data.email).first()

      if (existingUser) {
        const isActiveSuperAdmin = await db
          .from('super_admins')
          .where('user_id', existingUser.id)
          .whereNull('revoked_at')
          .first()

        if (!isActiveSuperAdmin) {
          const hasSchoolMembership = await db
            .from('school_users')
            .where('school_id', schoolId)
            .where('user_id', existingUser.id)
            .first()

          if (hasSchoolMembership) {
            const alreadyLinkedStaff = await Staff.query()
              .where('schoolId', schoolId)
              .where('userId', existingUser.id)
              .first()

            if (alreadyLinkedStaff) {
              const error = new Error(
                'This email is already linked to another staff member in this school'
              ) as Error & { code: string }
              error.code = 'E_USER_ALREADY_LINKED_TO_STAFF'
              throw error
            }

            linkedUserId = existingUser.id
          }
        }
      }
    }

    const staff = await Staff.create({
      schoolId,
      staffMemberId,
      userId: linkedUserId,
      ...data,
      dateOfBirth: data.dateOfBirth ? DateTime.fromJSDate(data.dateOfBirth) : undefined,
      joiningDate: data.joiningDate ? DateTime.fromJSDate(data.joiningDate) : undefined,
    })

    await AuditService.logCreate(
      'Staff',
      staff.id,
      { firstName: staff.firstName, lastName: staff.lastName, staffMemberId: staff.staffMemberId, email: staff.email },
      ctx,
      schoolId,
      userId
    )

    return staff
  }

  static async #generateStaffId(schoolId: string): Promise<string> {
    const count = await Staff.query().where('schoolId', schoolId).count('* as total')
    const total = Number(count[0].$extras.total) + 1
    return `STF-${total.toString().padStart(4, '0')}`
  }
}

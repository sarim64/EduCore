import Staff from '#models/staff_member'
import User from '#models/user'
import { createStaffValidator } from '#validators/staff'
import { Infer } from '@vinejs/vine/types'
import { DateTime } from 'luxon'
import db from '@adonisjs/lucid/services/db'
import SubscriptionLimitService from '#services/subscription_limit_service'

type Params = {
  schoolId: string
  data: Infer<typeof createStaffValidator>
}

export default class StoreStaff {
  static async handle({ schoolId, data }: Params) {
    await SubscriptionLimitService.assertCanAddStaff(schoolId, 1)

    // Generate unique staff ID
    const staffMemberId = await this.#generateStaffId(schoolId)
    let userId: string | undefined

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

            userId = existingUser.id
          }
        }
      }
    }

    return Staff.create({
      schoolId,
      staffMemberId,
      userId,
      ...data,
      dateOfBirth: data.dateOfBirth ? DateTime.fromJSDate(data.dateOfBirth) : undefined,
      joiningDate: data.joiningDate ? DateTime.fromJSDate(data.joiningDate) : undefined,
    })
  }

  static async #generateStaffId(schoolId: string): Promise<string> {
    // Get the count of staff in this school
    const count = await Staff.query().where('schoolId', schoolId).count('* as total')
    const total = Number(count[0].$extras.total) + 1

    // Format: STF-XXXX (zero-padded)
    return `STF-${total.toString().padStart(4, '0')}`
  }
}

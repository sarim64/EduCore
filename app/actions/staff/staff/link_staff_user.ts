import Staff from '#models/staff_member'
import User from '#models/user'
import { linkUserValidator } from '#validators/staff_user'
import { Infer } from '@vinejs/vine/types'
import db from '@adonisjs/lucid/services/db'

type Params = {
  staff: Staff
  schoolId: string
  data: Infer<typeof linkUserValidator>
}

export default class LinkStaffUser {
  static async handle({ staff, schoolId, data }: Params) {
    return db.transaction(async (trx) => {
      let user: User

      if (data.action === 'create') {
        if (!staff.email) {
          const error = new Error('Staff must have an email address to create or link account') as Error & {
            code: string
          }
          error.code = 'E_STAFF_EMAIL_REQUIRED'
          throw error
        }

        const existingUser = await User.query({ client: trx }).where('email', staff.email).first()

        if (existingUser) {
          const error = new Error(
            'This email address is already associated with an existing user account. Use the "link existing user" option instead.'
          ) as Error & { code: string }
          error.code = 'E_EMAIL_ALREADY_TAKEN'
          throw error
        } else {
          if (!data.password || data.password.length < 8) {
            const error = new Error(
              'A password with at least 8 characters is required to create a new user account'
            ) as Error & { code: string }
            error.code = 'E_PASSWORD_REQUIRED'
            throw error
          }

          if (!data.roleId) {
            const error = new Error('Role is required to add the new user to this school') as Error & {
              code: string
            }
            error.code = 'E_ROLE_REQUIRED'
            throw error
          }

          user = await User.create(
            {
              email: staff.email,
              firstName: staff.firstName,
              lastName: staff.lastName,
              password: data.password,
            },
            { client: trx }
          )
        }
      } else {
        user = await User.findOrFail(data.userId!, { client: trx })
      }

      const isActiveSuperAdmin = await trx
        .from('super_admins')
        .where('user_id', user.id)
        .whereNull('revoked_at')
        .first()

      if (isActiveSuperAdmin) {
        const error = new Error('Super admin accounts cannot be linked to staff') as Error & {
          code: string
        }
        error.code = 'E_SUPER_ADMIN_NOT_LINKABLE'
        throw error
      }

      // Ensure user belongs to this school. If not, role is required to add membership.
      const existingSchoolMembership = await trx
        .from('school_users')
        .where('school_id', schoolId)
        .where('user_id', user.id)
        .first()

      if (!existingSchoolMembership) {
        if (!data.roleId) {
          const error = new Error('Role is required to add user to this school') as Error & {
            code: string
          }
          error.code = 'E_ROLE_REQUIRED'
          throw error
        }

        user.useTransaction(trx)
        await user.related('schools').attach({
          [schoolId]: { role_id: data.roleId },
        })
      }

      // Same user cannot be linked to multiple staff records in the same school.
      const existingStaffLink = await Staff.query({ client: trx })
        .where('schoolId', schoolId)
        .where('userId', user.id)
        .whereNot('id', staff.id)
        .first()

      if (existingStaffLink) {
        const error = new Error('This user is already linked to another staff member') as Error & {
          code: string
        }
        error.code = 'E_USER_ALREADY_LINKED_TO_STAFF'
        throw error
      }

      // Update staff with user ID
      staff.useTransaction(trx)
      staff.userId = user.id
      await staff.save()

      return user
    })
  }
}

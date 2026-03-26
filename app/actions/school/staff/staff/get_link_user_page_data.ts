import User from '#models/user'
import Staff from '#models/staff_member'
import db from '@adonisjs/lucid/services/db'

export type LinkableUser = {
  id: string
  firstName: string
  lastName: string | null
  email: string
  fullName: string
}

export type MatchedEmailUser = LinkableUser & { isInCurrentSchool: boolean }

export type LinkUserPageData = {
  users: LinkableUser[]
  matchedEmailUser: MatchedEmailUser | null
}

export default class GetLinkUserPageData {
  static async handle(staff: Staff, schoolId: string): Promise<LinkUserPageData> {
    const linkedUserIdsQuery = Staff.query()
      .where('schoolId', schoolId)
      .whereNotNull('userId')
      .select('userId')

    const schoolUserIdsQuery = db.from('school_users').where('school_id', schoolId).select('user_id')

    const superAdminIdsQuery = db.from('super_admins').whereNull('revoked_at').select('user_id')

    const users = await User.query()
      .whereIn('id', schoolUserIdsQuery)
      .whereNotIn('id', linkedUserIdsQuery)
      .whereNotIn('id', superAdminIdsQuery)
      .orderBy('firstName', 'asc')

    let matchedEmailUser: MatchedEmailUser | null = null

    if (staff.email) {
      const existingByEmail = await User.query()
        .where('email', staff.email)
        .whereNotIn('id', superAdminIdsQuery)
        .first()

      if (existingByEmail) {
        const inSchool = await db
          .from('school_users')
          .where('school_id', schoolId)
          .where('user_id', existingByEmail.id)
          .first()

        matchedEmailUser = {
          id: existingByEmail.id,
          firstName: existingByEmail.firstName,
          lastName: existingByEmail.lastName,
          email: existingByEmail.email,
          fullName: `${existingByEmail.firstName} ${existingByEmail.lastName ?? ''}`.trim(),
          isInCurrentSchool: !!inSchool,
        }
      }
    }

    return {
      users: users.map((u) => ({
        id: u.id,
        firstName: u.firstName,
        lastName: u.lastName,
        email: u.email,
        fullName: `${u.firstName} ${u.lastName ?? ''}`.trim(),
      })),
      matchedEmailUser,
    }
  }
}

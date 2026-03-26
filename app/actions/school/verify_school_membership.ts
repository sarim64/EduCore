import db from '@adonisjs/lucid/services/db'

export default class VerifySchoolMembership {
  static async handle(userId: string, schoolId: string): Promise<boolean> {
    const row = await db
      .from('school_users')
      .where('school_id', schoolId)
      .where('user_id', userId)
      .first()

    return !!row
  }
}

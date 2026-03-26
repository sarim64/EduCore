import db from '@adonisjs/lucid/services/db'

export type UserSchool = {
  id: string
  name: string
  code: string
  role_name: string
}

export default class ListUserSchools {
  static async handle(userId: string): Promise<UserSchool[]> {
    return db
      .from('school_users as su')
      .innerJoin('schools as s', 's.id', 'su.school_id')
      .innerJoin('roles as r', 'r.id', 'su.role_id')
      .where('su.user_id', userId)
      .select('s.id', 's.name', 's.code', 'r.name as role_name')
      .orderBy('s.name', 'asc')
  }
}

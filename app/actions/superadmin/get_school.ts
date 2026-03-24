import School from '#models/school'
import Student from '#models/student'
import Roles from '#enums/roles'

export default class GetSchool {
  static async handle({ id }: { id: string }) {
    const school = await School.query()
      .where('id', id)
      .preload('subscriptions', (q) => q.preload('plan').orderBy('start_date', 'asc'))
      .preload('users', (q) => q.pivotColumns(['role_id']))
      .firstOrFail()

    const studentsCountResult = await Student.query()
      .where('schoolId', id)
      .count('* as total')

    const studentsCount = Number(studentsCountResult[0].$extras.total)

    const primaryAdminUser = school.users.find(
      (u) => Number(u.$extras.pivot_role_id) === Roles.SCHOOL_ADMIN
    )
    const primaryAdmin = primaryAdminUser
      ? { name: primaryAdminUser.fullName, email: primaryAdminUser.email }
      : null

    return { school, studentsCount, primaryAdmin }
  }
}

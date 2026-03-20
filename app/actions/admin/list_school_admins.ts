import School from '#models/school'
import Roles from '#enums/roles'

type Params = {
  schoolId: string
}

export default class ListSchoolAdmins {
  static async handle({ schoolId }: Params) {
    const school = await School.query()
      .where('id', schoolId)
      .preload('users', (query) => {
        query.pivotColumns(['role_id']).wherePivot('role_id', Roles.SCHOOL_ADMIN)
      })
      .firstOrFail()

    return {
      school,
      admins: school.users,
    }
  }
}

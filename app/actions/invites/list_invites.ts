import School from '#models/school'
import SchoolInvite from '#models/school_invite'

type Params = {
  school: School
}

export default class ListInvites {
  static async handle({ school }: Params) {
    return SchoolInvite.query()
      .where('schoolId', school.id)
      .preload('invitedByUser')
      .preload('role')
      .orderBy('createdAt', 'desc')
  }
}

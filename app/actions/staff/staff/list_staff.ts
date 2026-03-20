import Staff from '#models/staff_member'

type Params = {
  schoolId: string
  status?: 'active' | 'inactive' | 'terminated'
}

export default class ListStaff {
  static async handle({ schoolId, status }: Params) {
    const query = Staff.query()
      .where('schoolId', schoolId)
      .preload('department')
      .preload('designation')
      .preload('user')

    if (status) {
      query.where('status', status)
    }

    return query.orderBy('firstName', 'asc')
  }
}

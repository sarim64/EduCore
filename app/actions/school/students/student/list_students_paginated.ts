import Student from '#models/student'

type Params = {
  schoolId: string
  page?: number
  search?: string
  status?: string
}

export default class ListStudentsPaginated {
  static async handle({ schoolId, page = 1, search, status }: Params) {
    let query = Student.query()
      .where('schoolId', schoolId)
      .preload('enrollments', (q) => {
        q.preload('class')
        q.preload('section')
        q.preload('academicYear')
        q.orderBy('createdAt', 'desc')
        q.limit(1)
      })
      .orderBy('firstName', 'asc')

    if (search) {
      query = query.where((q) => {
        q.whereILike('firstName', `%${search}%`)
          .orWhereILike('lastName', `%${search}%`)
          .orWhereILike('studentId', `%${search}%`)
          .orWhereILike('email', `%${search}%`)
      })
    }

    if (status) {
      query = query.where('status', status)
    }

    return query.paginate(page, 20)
  }
}

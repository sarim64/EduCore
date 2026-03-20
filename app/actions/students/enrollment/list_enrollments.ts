import Enrollment from '#models/enrollment'

type Params = {
  schoolId: string
  status?: string
  classId?: string
  academicYearId?: string
}

export default class ListEnrollments {
  static async handle({ schoolId, status, classId, academicYearId }: Params) {
    let query = Enrollment.query()
      .where('schoolId', schoolId)
      .preload('student')
      .preload('class')
      .preload('section')
      .preload('academicYear')

    if (status) {
      query = query.where('status', status)
    }

    if (classId) {
      query = query.where('classId', classId)
    }

    if (academicYearId) {
      query = query.where('academicYearId', academicYearId)
    }

    return query.orderBy('createdAt', 'desc')
  }
}

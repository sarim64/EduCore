import Enrollment from '#models/enrollment'

type Params = {
  enrollmentId: string
  schoolId: string
}

export default class GetEnrollment {
  static async handle({ enrollmentId, schoolId }: Params) {
    return Enrollment.query()
      .where('id', enrollmentId)
      .where('schoolId', schoolId)
      .preload('student')
      .preload('class')
      .preload('section')
      .preload('academicYear')
      .firstOrFail()
  }
}

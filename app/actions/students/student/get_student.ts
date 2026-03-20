import Student from '#models/student'

type Params = {
  studentId: string
  schoolId: string
}

export default class GetStudent {
  static async handle({ studentId, schoolId }: Params) {
    return Student.query()
      .where('id', studentId)
      .where('schoolId', schoolId)
      .preload('guardians')
      .preload('enrollments', (enrollmentQuery) => {
        enrollmentQuery.preload('class').preload('section').preload('academicYear')
      })
      .preload('documents')
      .firstOrFail()
  }
}

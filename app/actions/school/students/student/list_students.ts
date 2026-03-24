import Student from '#models/student'

type Params = {
  schoolId: string
  classId?: string
  sectionId?: string
  search?: string
}

export default class ListStudents {
  static async handle({ schoolId, classId, sectionId, search }: Params) {
    let query = Student.query()
      .where('schoolId', schoolId)
      .preload('guardians')
      .preload('enrollments', (enrollmentQuery) => {
        enrollmentQuery.preload('class').preload('section').preload('academicYear')
      })

    if (classId) {
      query = query.whereHas('enrollments', (enrollmentQuery) => {
        enrollmentQuery.where('classId', classId).where('status', 'active')
      })
    }

    if (sectionId) {
      query = query.whereHas('enrollments', (enrollmentQuery) => {
        enrollmentQuery.where('sectionId', sectionId).where('status', 'active')
      })
    }

    if (search) {
      query = query.where((searchQuery) => {
        searchQuery
          .whereILike('firstName', `%${search}%`)
          .orWhereILike('lastName', `%${search}%`)
          .orWhereILike('admissionNumber', `%${search}%`)
      })
    }

    return query.orderBy('firstName', 'asc')
  }
}

import StudentDiscount from '#models/student_discount'

type Params = {
  schoolId: string
  studentId?: string
  academicYearId?: string
  includeInactive?: boolean
}

export default class ListStudentDiscounts {
  static async handle({ schoolId, studentId, academicYearId, includeInactive = false }: Params) {
    const query = StudentDiscount.query()
      .where('schoolId', schoolId)
      .preload('student')
      .preload('feeDiscount', (q) => q.preload('feeCategory'))
      .preload('academicYear')
      .orderBy('createdAt', 'desc')

    if (studentId) {
      query.where('studentId', studentId)
    }

    if (academicYearId) {
      query.where('academicYearId', academicYearId)
    }

    if (!includeInactive) {
      query.where('isActive', true)
    }

    return query
  }
}

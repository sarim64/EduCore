import Enrollment from '#models/enrollment'
import type Student from '#models/student'

type Params = {
  schoolId: string
  classId: string
  academicYearId?: string
  sectionId?: string
}

export default class ListEnrolledStudents {
  static async handle({ schoolId, classId, academicYearId, sectionId }: Params): Promise<Student[]> {
    const query = Enrollment.query()
      .where('schoolId', schoolId)
      .where('classId', classId)
      .where('status', 'active')
      .preload('student')

    if (academicYearId) {
      query.where('academicYearId', academicYearId)
    }

    if (sectionId) {
      query.where('sectionId', sectionId)
    }

    const enrollments = await query
    return enrollments.map((e) => e.student)
  }
}

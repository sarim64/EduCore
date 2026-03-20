import Enrollment from '#models/enrollment'
import Student from '#models/student'
import AcademicYear from '#models/academic_year'
import SchoolClass from '#models/school_class'
import Section from '#models/section'
import { createEnrollmentValidator } from '#validators/enrollment'
import { Infer } from '@vinejs/vine/types'
import { DateTime } from 'luxon'

type Params = {
  schoolId: string
  data: Infer<typeof createEnrollmentValidator>
}

export default class StoreEnrollment {
  static async handle({ schoolId, data }: Params) {
    // Verify all entities belong to the school
    await Student.query().where('id', data.studentId).where('schoolId', schoolId).firstOrFail()

    await AcademicYear.query()
      .where('id', data.academicYearId)
      .where('schoolId', schoolId)
      .firstOrFail()

    await SchoolClass.query().where('id', data.classId).where('schoolId', schoolId).firstOrFail()

    if (data.sectionId) {
      await Section.query().where('id', data.sectionId).where('classId', data.classId).firstOrFail()
    }

    const existing = await Enrollment.query()
      .where('schoolId', schoolId)
      .where('studentId', data.studentId)
      .where('academicYearId', data.academicYearId)
      .first()

    if (existing) {
      const error = new Error('Student is already enrolled for this academic year') as Error & {
        code: string
      }
      error.code = 'E_DUPLICATE_ENROLLMENT'
      throw error
    }

    const enrollment = await Enrollment.create({
      schoolId,
      studentId: data.studentId,
      academicYearId: data.academicYearId,
      classId: data.classId,
      sectionId: data.sectionId,
      rollNumber: data.rollNumber,
      enrollmentDate: DateTime.fromJSDate(data.enrollmentDate),
      status: 'active',
    })

    return enrollment
  }
}

import StudentAttendance from '#models/student_attendance'
import Student from '#models/student'
import SchoolClass from '#models/school_class'
import Section from '#models/section'
import AcademicYear from '#models/academic_year'
import Enrollment from '#models/enrollment'
import MarkStudentAttendance from '#actions/attendance/mark_student_attendance'
import MarkBulkStudentAttendance from '#actions/attendance/mark_bulk_student_attendance'
import StudentAttendanceDto from '#dtos/student_attendance'
import StudentDto from '#dtos/student'
import {
  markStudentAttendanceValidator,
  bulkStudentAttendanceValidator,
} from '#validators/student_attendance'
import type { HttpContext } from '@adonisjs/core/http'

export default class StudentAttendancesController {
  async index({ session, inertia }: HttpContext) {
    const schoolId = session.get('schoolId')

    const classes = await SchoolClass.query().where('schoolId', schoolId).orderBy('name', 'asc')

    const academicYears = await AcademicYear.query()
      .where('schoolId', schoolId)
      .orderBy('startDate', 'desc')

    return inertia.render('attendance/students/index', {
      classes,
      academicYears,
    })
  }

  async markForm({ session, inertia }: HttpContext) {
    const schoolId = session.get('schoolId')

    const students = await Student.query()
      .where('schoolId', schoolId)
      .where('status', 'active')
      .orderBy('firstName', 'asc')

    const classes = await SchoolClass.query().where('schoolId', schoolId).orderBy('name', 'asc')

    const academicYears = await AcademicYear.query()
      .where('schoolId', schoolId)
      .orderBy('startDate', 'desc')

    const currentYear = academicYears.find((y) => y.isCurrent) || academicYears[0]

    return inertia.render('attendance/students/mark', {
      students: StudentDto.fromArray(students),
      classes,
      academicYears,
      currentYear,
    })
  }

  async mark({ request, response, session, auth }: HttpContext) {
    const schoolId = session.get('schoolId')
    const userId = auth.user!.id

    try {
      const data = await request.validateUsing(markStudentAttendanceValidator)

      await MarkStudentAttendance.handle({ schoolId, userId, data })

      session.flash('success', 'Attendance marked successfully')
      return response.redirect().toPath('/attendance/students')
    } catch (error) {
      if (error instanceof Error) {
        session.flash('errors', { general: error.message })
      }
      return response.redirect().back()
    }
  }

  async studentHistory({ params, session, inertia }: HttpContext) {
    const schoolId = session.get('schoolId')

    const student = await Student.query()
      .where('id', params.studentId)
      .where('schoolId', schoolId)
      .firstOrFail()

    const attendances = await StudentAttendance.query()
      .where('schoolId', schoolId)
      .where('studentId', params.studentId)
      .orderBy('date', 'desc')
      .limit(100)

    return inertia.render('attendance/students/history', {
      student: new StudentDto(student),
      attendances: StudentAttendanceDto.fromArray(attendances),
    })
  }

  async bulkMarkForm({ request, session, inertia }: HttpContext) {
    const schoolId = session.get('schoolId')
    const classId = request.input('classId')
    const sectionId = request.input('sectionId')

    const classes = await SchoolClass.query().where('schoolId', schoolId).orderBy('name', 'asc')

    const academicYears = await AcademicYear.query()
      .where('schoolId', schoolId)
      .orderBy('startDate', 'desc')

    const currentYear = academicYears.find((y) => y.isCurrent) || academicYears[0]

    let students: Student[] = []
    let sections: Section[] = []

    if (classId) {
      // Get sections for this class
      sections = await Section.query()
        .where('schoolId', schoolId)
        .where('classId', classId)
        .orderBy('name', 'asc')

      // Get students enrolled in this class for the current academic year
      const enrollmentQuery = Enrollment.query()
        .where('schoolId', schoolId)
        .where('classId', classId)
        .where('status', 'active')

      if (currentYear) {
        enrollmentQuery.where('academicYearId', currentYear.id)
      }

      if (sectionId) {
        enrollmentQuery.where('sectionId', sectionId)
      }

      const enrollments = await enrollmentQuery.preload('student')
      students = enrollments.map((e) => e.student)
    }

    return inertia.render('attendance/students/bulk-mark', {
      classes,
      sections,
      academicYears,
      currentYear,
      students: StudentDto.fromArray(students),
      selectedClassId: classId || '',
      selectedSectionId: sectionId || '',
    })
  }

  async bulkMark({ request, response, session, auth }: HttpContext) {
    const schoolId = session.get('schoolId')
    const userId = auth.user!.id

    try {
      const data = await request.validateUsing(bulkStudentAttendanceValidator)

      await MarkBulkStudentAttendance.handle({ schoolId, userId, data })

      session.flash('success', `Attendance marked for ${data.attendances.length} students`)
      return response.redirect().toPath('/attendance/students')
    } catch (error) {
      if (error instanceof Error) {
        session.flash('errors', { general: error.message })
      }
      return response.redirect().back()
    }
  }
}

import ListClasses from '#actions/school/academics/class/list_classes'
import ListAcademicYears from '#actions/school/academics/year/list_academic_years'
import ListSections from '#actions/school/academics/section/list_sections'
import ListStudents from '#actions/school/students/student/list_students'
import ListEnrolledStudents from '#actions/school/attendance/list_enrolled_students'
import GetStudentAttendanceHistory from '#actions/school/attendance/get_student_attendance_history'
import MarkStudentAttendance from '#actions/school/attendance/mark_student_attendance'
import MarkBulkStudentAttendance from '#actions/school/attendance/mark_bulk_student_attendance'
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

    const [classes, academicYears] = await Promise.all([
      ListClasses.handle({ schoolId }),
      ListAcademicYears.handle({ schoolId }),
    ])

    return inertia.render('school/attendance/students/index', {
      classes,
      academicYears,
    })
  }

  async markForm({ session, inertia }: HttpContext) {
    const schoolId = session.get('schoolId')

    const [students, classes, academicYears] = await Promise.all([
      ListStudents.handle({ schoolId, status: 'active' }),
      ListClasses.handle({ schoolId }),
      ListAcademicYears.handle({ schoolId }),
    ])

    const currentYear = academicYears.find((y) => y.isCurrent) || academicYears[0]

    return inertia.render('school/attendance/students/mark', {
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

    const { student, attendances } = await GetStudentAttendanceHistory.handle({
      studentId: params.studentId,
      schoolId,
    })

    return inertia.render('school/attendance/students/history', {
      student: new StudentDto(student),
      attendances: StudentAttendanceDto.fromArray(attendances),
    })
  }

  async bulkMarkForm({ request, session, inertia }: HttpContext) {
    const schoolId = session.get('schoolId')
    const classId = request.input('classId')
    const sectionId = request.input('sectionId')

    const [classes, academicYears] = await Promise.all([
      ListClasses.handle({ schoolId }),
      ListAcademicYears.handle({ schoolId }),
    ])

    const currentYear = academicYears.find((y) => y.isCurrent) || academicYears[0]

    const [sections, students] = await Promise.all([
      classId ? ListSections.handle({ schoolId, classId }) : Promise.resolve([]),
      classId
        ? ListEnrolledStudents.handle({
            schoolId,
            classId,
            academicYearId: currentYear?.id,
            sectionId: sectionId || undefined,
          })
        : Promise.resolve([]),
    ])

    return inertia.render('school/attendance/students/bulk-mark', {
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

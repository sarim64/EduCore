import SchoolClass from '#models/school_class'
import Student from '#models/student'
import AttendanceReportService from '#services/attendance_report_service'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'

export default class AttendanceReportsController {
  async index({ session, inertia }: HttpContext) {
    const schoolId = session.get('schoolId')

    // Get classes for filter dropdown
    const classes = await SchoolClass.query()
      .where('schoolId', schoolId)
      .preload('sections')
      .orderBy('name', 'asc')

    const classesData = classes.map((c) => ({
      id: c.id,
      name: c.name,
      sections: c.sections.map((s) => ({ id: s.id, name: s.name })),
    }))

    return inertia.render('school/attendance/reports/index', {
      classes: classesData,
    })
  }

  async daily({ request, session, inertia }: HttpContext) {
    const schoolId = session.get('schoolId')
    const classId = request.input('classId')
    const sectionId = request.input('sectionId')
    const dateStr = request.input('date', DateTime.now().toISODate())

    const classes = await SchoolClass.query()
      .where('schoolId', schoolId)
      .preload('sections')
      .orderBy('name', 'asc')

    const classesData = classes.map((c) => ({
      id: c.id,
      name: c.name,
      sections: c.sections.map((s) => ({ id: s.id, name: s.name })),
    }))

    let report = null
    if (classId) {
      const date = DateTime.fromISO(dateStr)
      report = await AttendanceReportService.getDailyStudentReport(
        schoolId,
        classId,
        sectionId || null,
        date
      )
    }

    return inertia.render('school/attendance/reports/daily', {
      classes: classesData,
      selectedClassId: classId || null,
      selectedSectionId: sectionId || null,
      selectedDate: dateStr,
      report,
    })
  }

  async monthly({ request, session, inertia }: HttpContext) {
    const schoolId = session.get('schoolId')
    const classId = request.input('classId')
    const sectionId = request.input('sectionId')
    const year = request.input('year', DateTime.now().year)
    const month = request.input('month', DateTime.now().month)

    const classes = await SchoolClass.query()
      .where('schoolId', schoolId)
      .preload('sections')
      .orderBy('name', 'asc')

    const classesData = classes.map((c) => ({
      id: c.id,
      name: c.name,
      sections: c.sections.map((s) => ({ id: s.id, name: s.name })),
    }))

    let report = null
    if (classId) {
      report = await AttendanceReportService.getMonthlyStudentReport(
        schoolId,
        classId,
        sectionId || null,
        Number(year),
        Number(month)
      )
    }

    return inertia.render('school/attendance/reports/monthly', {
      classes: classesData,
      selectedClassId: classId || null,
      selectedSectionId: sectionId || null,
      selectedYear: Number(year),
      selectedMonth: Number(month),
      report,
    })
  }

  async student({ params, request, session, inertia }: HttpContext) {
    const schoolId = session.get('schoolId')
    const studentId = params.studentId
    const fromDateStr = request.input('fromDate', DateTime.now().startOf('month').toISODate())
    const toDateStr = request.input('toDate', DateTime.now().toISODate())

    const student = await Student.query()
      .where('id', studentId)
      .where('schoolId', schoolId)
      .preload('enrollments', (query) => {
        query.orderBy('enrollmentDate', 'desc').preload('class').preload('section').limit(1)
      })
      .firstOrFail()

    const fromDate = DateTime.fromISO(fromDateStr)
    const toDate = DateTime.fromISO(toDateStr)

    const report = await AttendanceReportService.getStudentAttendanceHistory(
      schoolId,
      studentId,
      fromDate,
      toDate
    )

    const latestEnrollment = student.enrollments[0]

    return inertia.render('school/attendance/reports/student', {
      student: {
        id: student.id,
        firstName: student.firstName,
        lastName: student.lastName,
        studentId: student.studentId,
        className: latestEnrollment?.class?.name ?? null,
        sectionName: latestEnrollment?.section?.name ?? null,
      },
      fromDate: fromDateStr,
      toDate: toDateStr,
      report,
    })
  }

  async calendar({ request, session, inertia }: HttpContext) {
    const schoolId = session.get('schoolId')
    const classId = request.input('classId')
    const sectionId = request.input('sectionId')
    const year = request.input('year', DateTime.now().year)
    const month = request.input('month', DateTime.now().month)

    const classes = await SchoolClass.query()
      .where('schoolId', schoolId)
      .preload('sections')
      .orderBy('name', 'asc')

    const classesData = classes.map((c) => ({
      id: c.id,
      name: c.name,
      sections: c.sections.map((s) => ({ id: s.id, name: s.name })),
    }))

    let calendarData = null
    if (classId) {
      calendarData = await AttendanceReportService.getCalendarView(
        schoolId,
        classId,
        sectionId || null,
        Number(year),
        Number(month)
      )
    }

    return inertia.render('school/attendance/reports/calendar', {
      classes: classesData,
      selectedClassId: classId || null,
      selectedSectionId: sectionId || null,
      selectedYear: Number(year),
      selectedMonth: Number(month),
      calendarData,
    })
  }

  async summary({ request, session, inertia }: HttpContext) {
    const schoolId = session.get('schoolId')
    const dateStr = request.input('date', DateTime.now().toISODate())

    const date = DateTime.fromISO(dateStr)

    const studentSummary = await AttendanceReportService.getAttendanceSummary(schoolId, date)
    const staffSummary = await AttendanceReportService.getStaffAttendanceSummary(schoolId, date)

    return inertia.render('school/attendance/reports/summary', {
      selectedDate: dateStr,
      studentSummary,
      staffSummary,
    })
  }
}

import StudentAttendance from '#models/student_attendance'
import StaffAttendance from '#models/staff_attendance'
import Student from '#models/student'
import Staff from '#models/staff_member'
import SchoolClass from '#models/school_class'
import Section from '#models/section'
import { DateTime } from 'luxon'
import db from '@adonisjs/lucid/services/db'
import type {
  DailyAttendanceReport,
  MonthlyAttendanceReport,
  StudentAttendanceReport,
  CalendarViewData,
  CalendarDay,
} from '#dtos/attendance_report'
import type {
  AttendanceSummaryReport,
  ClassAttendanceSummary,
  StaffAttendanceSummary,
  MonthlyStaffAttendanceReport,
} from '#dtos/attendance_summary'

export default class AttendanceReportService {
  static async getDailyStudentReport(
    schoolId: string,
    classId: string,
    sectionId: string | null,
    date: DateTime
  ): Promise<DailyAttendanceReport> {
    const schoolClass = await SchoolClass.findOrFail(classId)
    let section: Section | null = null
    if (sectionId) {
      section = await Section.find(sectionId)
    }

    // Get all students for the class/section
    let studentsQuery = Student.query()
      .where('schoolId', schoolId)
      .where('classId', classId)
      .where('status', 'active')
      .orderBy('firstName', 'asc')

    if (sectionId) {
      studentsQuery = studentsQuery.where('sectionId', sectionId)
    }

    const students = await studentsQuery

    // Get attendance records for the date
    const attendanceRecords = await StudentAttendance.query()
      .where('schoolId', schoolId)
      .where('classId', classId)
      .whereRaw('date = ?', [date.toISODate()!])
      .if(sectionId, (query) => query.where('sectionId', sectionId!))

    const attendanceMap = new Map(attendanceRecords.map((r) => [r.studentId, r]))

    let present = 0
    let absent = 0
    let late = 0
    let excused = 0
    let halfDay = 0

    const records = students.map((student) => {
      const attendance = attendanceMap.get(student.id)
      const status = attendance?.status ?? 'absent'
      const remarks = attendance?.remarks ?? null

      switch (status) {
        case 'present':
          present++
          break
        case 'absent':
          absent++
          break
        case 'late':
          late++
          break
        case 'excused':
          excused++
          break
        case 'half_day':
          halfDay++
          break
      }

      return {
        studentId: student.id,
        studentName: `${student.firstName} ${student.lastName ?? ''}`.trim(),
        studentIdNumber: student.studentId ?? '',
        status,
        remarks,
      }
    })

    const totalStudents = students.length
    const attendanceRate =
      totalStudents > 0 ? ((present + late + halfDay) / totalStudents) * 100 : 0

    return {
      date: date.toISODate()!,
      className: schoolClass.name,
      sectionName: section?.name ?? null,
      totalStudents,
      present,
      absent,
      late,
      excused,
      halfDay,
      attendanceRate: Math.round(attendanceRate * 100) / 100,
      records,
    }
  }

  static async getMonthlyStudentReport(
    schoolId: string,
    classId: string,
    sectionId: string | null,
    year: number,
    month: number
  ): Promise<MonthlyAttendanceReport> {
    const schoolClass = await SchoolClass.findOrFail(classId)
    let section: Section | null = null
    if (sectionId) {
      section = await Section.find(sectionId)
    }

    const startDate = DateTime.fromObject({ year, month, day: 1 })
    const endDate = startDate.endOf('month')

    // Get all students for the class/section
    let studentsQuery = Student.query()
      .where('schoolId', schoolId)
      .where('classId', classId)
      .where('status', 'active')
      .orderBy('firstName', 'asc')

    if (sectionId) {
      studentsQuery = studentsQuery.where('sectionId', sectionId)
    }

    const students = await studentsQuery

    // Get all attendance records for the month
    let attendanceQuery = StudentAttendance.query()
      .where('schoolId', schoolId)
      .where('classId', classId)
      .whereRaw('date >= ?', [startDate.toISODate()!])
      .whereRaw('date <= ?', [endDate.toISODate()!])

    if (sectionId) {
      attendanceQuery = attendanceQuery.where('sectionId', sectionId)
    }

    const attendanceRecords = await attendanceQuery

    // Group records by student
    const studentRecords = new Map<
      string,
      { present: number; absent: number; late: number; excused: number; halfDay: number }
    >()
    attendanceRecords.forEach((record) => {
      const stats = studentRecords.get(record.studentId) || {
        present: 0,
        absent: 0,
        late: 0,
        excused: 0,
        halfDay: 0,
      }
      switch (record.status) {
        case 'present':
          stats.present++
          break
        case 'absent':
          stats.absent++
          break
        case 'late':
          stats.late++
          break
        case 'excused':
          stats.excused++
          break
        case 'half_day':
          stats.halfDay++
          break
      }
      studentRecords.set(record.studentId, stats)
    })

    // Calculate working days (number of unique dates with attendance)
    const uniqueDates = new Set(attendanceRecords.map((r) => r.date.toISODate()))
    const workingDays = uniqueDates.size

    let totalAttendanceRate = 0
    const records = students.map((student) => {
      const stats = studentRecords.get(student.id) || {
        present: 0,
        absent: 0,
        late: 0,
        excused: 0,
        halfDay: 0,
      }
      const totalDays = stats.present + stats.absent + stats.late + stats.excused + stats.halfDay
      const attendanceRate =
        totalDays > 0 ? ((stats.present + stats.late + stats.halfDay) / totalDays) * 100 : 0

      totalAttendanceRate += attendanceRate

      return {
        studentId: student.id,
        studentName: `${student.firstName} ${student.lastName ?? ''}`.trim(),
        studentIdNumber: student.studentId ?? '',
        ...stats,
        totalDays,
        attendanceRate: Math.round(attendanceRate * 100) / 100,
      }
    })

    const averageAttendanceRate = students.length > 0 ? totalAttendanceRate / students.length : 0

    return {
      month: startDate.toFormat('MMMM'),
      year,
      className: schoolClass.name,
      sectionName: section?.name ?? null,
      totalStudents: students.length,
      workingDays,
      averageAttendanceRate: Math.round(averageAttendanceRate * 100) / 100,
      records,
    }
  }

  static async getStudentAttendanceHistory(
    schoolId: string,
    studentId: string,
    fromDate: DateTime,
    toDate: DateTime
  ): Promise<StudentAttendanceReport> {
    const student = await Student.query()
      .where('id', studentId)
      .where('schoolId', schoolId)
      .preload('enrollments', (query) => {
        query.orderBy('enrollmentDate', 'desc').preload('class').preload('section').limit(1)
      })
      .firstOrFail()

    const attendanceRecords = await StudentAttendance.query()
      .where('schoolId', schoolId)
      .where('studentId', studentId)
      .whereRaw('date >= ?', [fromDate.toISODate()!])
      .whereRaw('date <= ?', [toDate.toISODate()!])
      .orderBy('date', 'desc')

    let present = 0
    let absent = 0
    let late = 0
    let excused = 0
    let halfDay = 0

    const records = attendanceRecords.map((record) => {
      switch (record.status) {
        case 'present':
          present++
          break
        case 'absent':
          absent++
          break
        case 'late':
          late++
          break
        case 'excused':
          excused++
          break
        case 'half_day':
          halfDay++
          break
      }

      return {
        date: record.date.toISODate()!,
        status: record.status,
        remarks: record.remarks,
      }
    })

    const totalDays = records.length
    const attendanceRate = totalDays > 0 ? ((present + late + halfDay) / totalDays) * 100 : 0

    const latestEnrollment = student.enrollments[0]

    return {
      studentId: student.id,
      studentName: `${student.firstName} ${student.lastName ?? ''}`.trim(),
      studentIdNumber: student.studentId ?? '',
      className: latestEnrollment?.class?.name ?? '',
      sectionName: latestEnrollment?.section?.name ?? null,
      fromDate: fromDate.toISODate()!,
      toDate: toDate.toISODate()!,
      totalDays,
      present,
      absent,
      late,
      excused,
      halfDay,
      attendanceRate: Math.round(attendanceRate * 100) / 100,
      records,
    }
  }

  static async getAttendanceSummary(
    schoolId: string,
    date: DateTime
  ): Promise<AttendanceSummaryReport> {
    // Get all classes for the school
    const classes = await SchoolClass.query()
      .where('schoolId', schoolId)
      .preload('sections')
      .orderBy('name', 'asc')

    const classSummaries: ClassAttendanceSummary[] = []
    let totalStudents = 0
    let totalPresent = 0

    for (const schoolClass of classes) {
      // Get students for this class
      const students = await Student.query()
        .where('schoolId', schoolId)
        .where('classId', schoolClass.id)
        .where('status', 'active')

      // Get attendance for the date
      const attendanceRecords = await StudentAttendance.query()
        .where('schoolId', schoolId)
        .where('classId', schoolClass.id)
        .whereRaw('date = ?', [date.toISODate()!])

      const statusCounts = {
        present: 0,
        absent: 0,
        late: 0,
        excused: 0,
        halfDay: 0,
      }

      attendanceRecords.forEach((record) => {
        switch (record.status) {
          case 'present':
            statusCounts.present++
            break
          case 'absent':
            statusCounts.absent++
            break
          case 'late':
            statusCounts.late++
            break
          case 'excused':
            statusCounts.excused++
            break
          case 'half_day':
            statusCounts.halfDay++
            break
        }
      })

      const classTotal = students.length
      const classPresent = statusCounts.present + statusCounts.late + statusCounts.halfDay
      const attendanceRate = classTotal > 0 ? (classPresent / classTotal) * 100 : 0

      totalStudents += classTotal
      totalPresent += classPresent

      classSummaries.push({
        classId: schoolClass.id,
        className: schoolClass.name,
        sectionId: null,
        sectionName: null,
        totalStudents: classTotal,
        ...statusCounts,
        attendanceRate: Math.round(attendanceRate * 100) / 100,
      })
    }

    const overallAttendanceRate = totalStudents > 0 ? (totalPresent / totalStudents) * 100 : 0

    return {
      date: date.toISODate()!,
      schoolId,
      totalClasses: classes.length,
      totalStudents,
      overallAttendanceRate: Math.round(overallAttendanceRate * 100) / 100,
      classes: classSummaries,
    }
  }

  static async getCalendarView(
    schoolId: string,
    classId: string,
    sectionId: string | null,
    year: number,
    month: number
  ): Promise<CalendarViewData> {
    const startDate = DateTime.fromObject({ year, month, day: 1 })
    const endDate = startDate.endOf('month')

    // Get attendance records for the month
    let query = db
      .from('student_attendances')
      .where('school_id', schoolId)
      .where('class_id', classId)
      .whereRaw('date >= ?', [startDate.toISODate()!])
      .whereRaw('date <= ?', [endDate.toISODate()!])
      .select('date')
      .select(db.raw("SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) as present"))
      .select(db.raw("SUM(CASE WHEN status = 'absent' THEN 1 ELSE 0 END) as absent"))
      .select(db.raw("SUM(CASE WHEN status = 'late' THEN 1 ELSE 0 END) as late"))
      .select(db.raw("SUM(CASE WHEN status = 'excused' THEN 1 ELSE 0 END) as excused"))
      .select(db.raw("SUM(CASE WHEN status = 'half_day' THEN 1 ELSE 0 END) as half_day"))
      .select(db.raw('COUNT(*) as total'))
      .groupBy('date')

    if (sectionId) {
      query = query.where('section_id', sectionId)
    }

    const records = await query

    const recordsMap = new Map(
      records.map((r) => [
        DateTime.fromJSDate(r.date).toISODate(),
        {
          present: Number(r.present),
          absent: Number(r.absent),
          late: Number(r.late),
          excused: Number(r.excused),
          halfDay: Number(r.half_day),
          total: Number(r.total),
        },
      ])
    )

    const days: CalendarDay[] = []
    let currentDate = startDate
    let totalWorkingDays = 0
    let totalAttendance = 0
    let totalCount = 0

    while (currentDate <= endDate) {
      const dateStr = currentDate.toISODate()!
      const dayOfWeek = currentDate.weekday
      const record = recordsMap.get(dateStr)

      let status: CalendarDay['status'] = 'no_data'
      if (record && record.total > 0) {
        totalWorkingDays++
        const presentCount = record.present + record.late + record.halfDay
        totalAttendance += presentCount
        totalCount += record.total

        // Determine overall status based on majority
        if (record.absent > record.present + record.late) {
          status = 'absent'
        } else if (record.late > record.present) {
          status = 'late'
        } else {
          status = 'present'
        }
      } else if (dayOfWeek === 6 || dayOfWeek === 7) {
        status = 'holiday'
      }

      days.push({
        date: dateStr,
        dayOfWeek,
        status,
        count: record,
      })

      currentDate = currentDate.plus({ days: 1 })
    }

    const averageAttendance = totalCount > 0 ? (totalAttendance / totalCount) * 100 : 0

    return {
      month: startDate.toFormat('MMMM'),
      year,
      days,
      summary: {
        totalWorkingDays,
        averageAttendance: Math.round(averageAttendance * 100) / 100,
      },
    }
  }

  static async getStaffAttendanceSummary(
    schoolId: string,
    date: DateTime
  ): Promise<StaffAttendanceSummary> {
    const totalStaff = await Staff.query()
      .where('schoolId', schoolId)
      .where('status', 'active')
      .count('* as total')

    const attendanceRecords = await StaffAttendance.query()
      .where('schoolId', schoolId)
      .whereRaw('date = ?', [date.toISODate()!])

    const statusCounts = {
      present: 0,
      absent: 0,
      late: 0,
      onLeave: 0,
      halfDay: 0,
    }

    attendanceRecords.forEach((record) => {
      switch (record.status) {
        case 'present':
          statusCounts.present++
          break
        case 'absent':
          statusCounts.absent++
          break
        case 'late':
          statusCounts.late++
          break
        case 'on_leave':
          statusCounts.onLeave++
          break
        case 'half_day':
          statusCounts.halfDay++
          break
      }
    })

    const total = Number(totalStaff[0].$extras.total)
    const present = statusCounts.present + statusCounts.late + statusCounts.halfDay
    const attendanceRate = total > 0 ? (present / total) * 100 : 0

    return {
      date: date.toISODate()!,
      totalStaff: total,
      ...statusCounts,
      attendanceRate: Math.round(attendanceRate * 100) / 100,
    }
  }

  static async getMonthlyStaffReport(
    schoolId: string,
    year: number,
    month: number
  ): Promise<MonthlyStaffAttendanceReport> {
    const startDate = DateTime.fromObject({ year, month, day: 1 })
    const endDate = startDate.endOf('month')

    const staffMembers = await Staff.query()
      .where('schoolId', schoolId)
      .where('status', 'active')
      .preload('department')
      .orderBy('firstName', 'asc')

    const attendanceRecords = await StaffAttendance.query()
      .where('schoolId', schoolId)
      .whereRaw('date >= ?', [startDate.toISODate()!])
      .whereRaw('date <= ?', [endDate.toISODate()!])

    const staffRecords = new Map<
      string,
      { present: number; absent: number; late: number; onLeave: number; halfDay: number }
    >()
    attendanceRecords.forEach((record) => {
      const stats = staffRecords.get(record.staffMemberId) || {
        present: 0,
        absent: 0,
        late: 0,
        onLeave: 0,
        halfDay: 0,
      }
      switch (record.status) {
        case 'present':
          stats.present++
          break
        case 'absent':
          stats.absent++
          break
        case 'late':
          stats.late++
          break
        case 'on_leave':
          stats.onLeave++
          break
        case 'half_day':
          stats.halfDay++
          break
      }
      staffRecords.set(record.staffMemberId, stats)
    })

    const uniqueDates = new Set(attendanceRecords.map((r) => r.date.toISODate()))
    const workingDays = uniqueDates.size

    let totalAttendanceRate = 0
    const records = staffMembers.map((staff) => {
      const stats = staffRecords.get(staff.id) || {
        present: 0,
        absent: 0,
        late: 0,
        onLeave: 0,
        halfDay: 0,
      }
      const totalDays = stats.present + stats.absent + stats.late + stats.onLeave + stats.halfDay
      const attendanceRate =
        totalDays > 0 ? ((stats.present + stats.late + stats.halfDay) / totalDays) * 100 : 0

      totalAttendanceRate += attendanceRate

      return {
        staffMemberId: staff.id,
        staffName: `${staff.firstName} ${staff.lastName ?? ''}`.trim(),
        staffIdNumber: staff.staffMemberId,
        department: staff.department?.name ?? null,
        ...stats,
        totalDays,
        attendanceRate: Math.round(attendanceRate * 100) / 100,
      }
    })

    const averageAttendanceRate =
      staffMembers.length > 0 ? totalAttendanceRate / staffMembers.length : 0

    return {
      month: startDate.toFormat('MMMM'),
      year,
      totalStaff: staffMembers.length,
      workingDays,
      averageAttendanceRate: Math.round(averageAttendanceRate * 100) / 100,
      records,
    }
  }
}

import Student from '#models/student'
import Staff from '#models/staff_member'
import SchoolClass from '#models/school_class'
import StudentAttendance from '#models/student_attendance'
import StaffAttendance from '#models/staff_attendance'
import TeacherAssignment from '#models/teacher_assignment'
import AcademicYear from '#models/academic_year'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'

export interface SchoolAdminDashboardStats {
  students: {
    total: number
    active: number
    inactive: number
    newThisMonth: number
    genderDistribution: { gender: string; count: number }[]
  }
  staff: {
    total: number
    active: number
    departments: { name: string; count: number }[]
  }
  classes: {
    total: number
    totalSections: number
    classStrength: { className: string; students: number }[]
  }
  attendance: {
    todayStudentRate: number
    todayStaffRate: number
    todayPresent: number
    todayAbsent: number
    weeklyTrend: { date: string; rate: number }[]
  }
}

export interface TeacherDashboardStats {
  profile: {
    staffMemberId: string
    name: string
    department: string | null
    designation: string | null
  }
  assignments: {
    total: number
    classTeacherOf: { className: string; sectionName: string | null }[]
    subjects: { className: string; sectionName: string | null; subjectName: string }[]
  }
  todayClasses: {
    className: string
    sectionName: string | null
    subjectName: string
  }[]
  attendance: {
    myClassesToday: {
      className: string
      sectionName: string | null
      present: number
      absent: number
      total: number
      rate: number
    }[]
  }
  recentAttendanceMarked: {
    date: string
    className: string
    sectionName: string | null
    markedCount: number
  }[]
}


export default class DashboardService {
  static async getSchoolAdminStats(schoolId: string): Promise<SchoolAdminDashboardStats> {
    const today = DateTime.now()
    const startOfMonth = today.startOf('month')
    const startOfWeek = today.startOf('week')

    // Parallel fetch for all stats
    const [studentStats, staffStats, classStats, attendanceStats] = await Promise.all([
      this.getStudentStats(schoolId, startOfMonth),
      this.getStaffStats(schoolId),
      this.getClassStats(schoolId),
      this.getAttendanceStats(schoolId, today, startOfWeek),
    ])

    return {
      students: studentStats,
      staff: staffStats,
      classes: classStats,
      attendance: attendanceStats,
    }
  }

  private static async getStudentStats(schoolId: string, startOfMonth: DateTime) {
    const [totalResult, activeResult, newThisMonthResult] = await Promise.all([
      Student.query().where('schoolId', schoolId).count('* as total'),
      Student.query().where('schoolId', schoolId).where('status', 'active').count('* as total'),
      Student.query()
        .where('schoolId', schoolId)
        .where('createdAt', '>=', startOfMonth.toSQL()!)
        .count('* as total'),
    ])

    const total = Number(totalResult[0].$extras.total)
    const active = Number(activeResult[0].$extras.total)
    const newThisMonth = Number(newThisMonthResult[0].$extras.total)

    // Gender distribution
    const genderData = await db
      .from('students')
      .where('school_id', schoolId)
      .where('status', 'active')
      .select('gender')
      .count('* as count')
      .groupBy('gender')

    const genderDistribution = genderData.map((g) => ({
      gender: g.gender || 'Not Specified',
      count: Number(g.count),
    }))

    return {
      total,
      active,
      inactive: total - active,
      newThisMonth,
      genderDistribution,
    }
  }

  private static async getStaffStats(schoolId: string) {
    const [totalResult, activeResult] = await Promise.all([
      Staff.query().where('schoolId', schoolId).count('* as total'),
      Staff.query().where('schoolId', schoolId).where('status', 'active').count('* as total'),
    ])

    const total = Number(totalResult[0].$extras.total)
    const active = Number(activeResult[0].$extras.total)

    // Department distribution
    const deptData = await db
      .from('staff_members')
      .leftJoin('departments', 'staff_members.department_id', 'departments.id')
      .where('staff_members.school_id', schoolId)
      .where('staff_members.status', 'active')
      .select('departments.name as department_name')
      .count('* as count')
      .groupBy('departments.name')

    const departments = deptData.map((d) => ({
      name: d.department_name || 'Unassigned',
      count: Number(d.count),
    }))

    return { total, active, departments }
  }

  private static async getClassStats(schoolId: string) {
    const classes = await SchoolClass.query().where('schoolId', schoolId).withCount('sections')

    // Get student count per class from enrollments
    const currentYear = await AcademicYear.query()
      .where('schoolId', schoolId)
      .where('isCurrent', true)
      .first()

    let classStrength: { className: string; students: number }[] = []

    if (currentYear) {
      const enrollmentData = await db
        .from('enrollments')
        .join('classes', 'enrollments.class_id', 'classes.id')
        .where('enrollments.school_id', schoolId)
        .where('enrollments.academic_year_id', currentYear.id)
        .where('enrollments.status', 'active')
        .select('classes.name as class_name')
        .count('* as count')
        .groupBy('classes.name')
        .orderBy('classes.name')

      classStrength = enrollmentData.map((e) => ({
        className: e.class_name,
        students: Number(e.count),
      }))
    }

    const totalSections = classes.reduce((sum, c) => sum + Number(c.$extras.sections_count || 0), 0)

    return {
      total: classes.length,
      totalSections,
      classStrength,
    }
  }

  private static async getAttendanceStats(
    schoolId: string,
    today: DateTime,
    startOfWeek: DateTime
  ) {
    const todayStr = today.toISODate()!

    // Today's student attendance
    const [todayStudentData, totalActiveStudents] = await Promise.all([
      StudentAttendance.query()
        .where('schoolId', schoolId)
        .whereRaw('date = ?', [todayStr])
        .select('status')
        .count('* as count')
        .groupBy('status'),
      Student.query().where('schoolId', schoolId).where('status', 'active').count('* as total'),
    ])

    const totalStudents = Number(totalActiveStudents[0].$extras.total)
    let todayPresent = 0
    let todayAbsent = 0

    todayStudentData.forEach((record) => {
      const count = Number(record.$extras.count)
      if (['present', 'late', 'half_day'].includes(record.status)) {
        todayPresent += count
      } else {
        todayAbsent += count
      }
    })

    const todayStudentRate = totalStudents > 0 ? (todayPresent / totalStudents) * 100 : 0

    // Today's staff attendance
    const [todayStaffData, totalActiveStaff] = await Promise.all([
      StaffAttendance.query()
        .where('schoolId', schoolId)
        .whereRaw('date = ?', [todayStr])
        .whereIn('status', ['present', 'late', 'half_day'])
        .count('* as count'),
      Staff.query().where('schoolId', schoolId).where('status', 'active').count('* as total'),
    ])

    const totalStaff = Number(totalActiveStaff[0].$extras.total)
    const staffPresent = Number(todayStaffData[0].$extras.count)
    const todayStaffRate = totalStaff > 0 ? (staffPresent / totalStaff) * 100 : 0

    // Weekly trend
    const weeklyData = await db
      .from('student_attendances')
      .where('school_id', schoolId)
      .whereRaw('date >= ?', [startOfWeek.toISODate()!])
      .whereRaw('date <= ?', [todayStr])
      .select('date')
      .select(
        db.raw(
          "SUM(CASE WHEN status IN ('present', 'late', 'half_day') THEN 1 ELSE 0 END) as present_count"
        )
      )
      .count('* as total')
      .groupBy('date')
      .orderBy('date')

    const weeklyTrend = weeklyData.map((d) => ({
      date: DateTime.fromJSDate(d.date).toFormat('EEE'),
      rate: Number(d.total) > 0 ? Math.round((Number(d.present_count) / Number(d.total)) * 100) : 0,
    }))

    return {
      todayStudentRate: Math.round(todayStudentRate),
      todayStaffRate: Math.round(todayStaffRate),
      todayPresent,
      todayAbsent,
      weeklyTrend,
    }
  }

  static async getTeacherStats(
    schoolId: string,
    staffMemberId: string
  ): Promise<TeacherDashboardStats> {
    const today = DateTime.now()

    // Get staff profile
    const staff = await Staff.query()
      .where('id', staffMemberId)
      .where('schoolId', schoolId)
      .preload('department')
      .preload('designation')
      .firstOrFail()

    // Get current academic year
    const currentYear = await AcademicYear.query()
      .where('schoolId', schoolId)
      .where('isCurrent', true)
      .first()

    if (!currentYear) {
      return {
        profile: {
          staffMemberId: staff.staffMemberId,
          name: staff.fullName,
          department: staff.department?.name || null,
          designation: staff.designation?.name || null,
        },
        assignments: { total: 0, classTeacherOf: [], subjects: [] },
        todayClasses: [],
        attendance: { myClassesToday: [] },
        recentAttendanceMarked: [],
      }
    }

    // Get assignments
    const assignments = await TeacherAssignment.query()
      .where('schoolId', schoolId)
      .where('staffMemberId', staffMemberId)
      .where('academicYearId', currentYear.id)
      .preload('class')
      .preload('section')
      .preload('subject')

    const classTeacherOf = assignments
      .filter((a) => a.isClassTeacher)
      .map((a) => ({
        className: a.class.name,
        sectionName: a.section?.name || null,
      }))

    const subjects = assignments.map((a) => ({
      className: a.class.name,
      sectionName: a.section?.name || null,
      subjectName: a.subject.name,
    }))

    // Get unique classes for today's attendance
    const uniqueClasses = new Map<
      string,
      { classId: string; sectionId: string | null; className: string; sectionName: string | null }
    >()
    assignments.forEach((a) => {
      const key = `${a.classId}-${a.sectionId || 'null'}`
      if (!uniqueClasses.has(key)) {
        uniqueClasses.set(key, {
          classId: a.classId,
          sectionId: a.sectionId,
          className: a.class.name,
          sectionName: a.section?.name || null,
        })
      }
    })

    // Get attendance for my classes today
    const todayStr = today.toISODate()!
    const myClassesToday: TeacherDashboardStats['attendance']['myClassesToday'] = []

    for (const classInfo of uniqueClasses.values()) {
      let query = StudentAttendance.query()
        .where('schoolId', schoolId)
        .where('classId', classInfo.classId)
        .whereRaw('date = ?', [todayStr])

      if (classInfo.sectionId) {
        query = query.where('sectionId', classInfo.sectionId)
      }

      const attendanceData = await query.select('status').count('* as count').groupBy('status')

      let present = 0
      let absent = 0
      let total = 0

      attendanceData.forEach((record) => {
        const count = Number(record.$extras.count)
        total += count
        if (['present', 'late', 'half_day'].includes(record.status)) {
          present += count
        } else {
          absent += count
        }
      })

      if (total > 0) {
        myClassesToday.push({
          className: classInfo.className,
          sectionName: classInfo.sectionName,
          present,
          absent,
          total,
          rate: Math.round((present / total) * 100),
        })
      }
    }

    // Get recent attendance marked by this teacher
    const recentMarked = await db
      .from('student_attendances')
      .join('classes', 'student_attendances.class_id', 'classes.id')
      .leftJoin('sections', 'student_attendances.section_id', 'sections.id')
      .where('student_attendances.school_id', schoolId)
      .where('student_attendances.marked_by_id', staffMemberId)
      .select('student_attendances.date')
      .select('classes.name as class_name')
      .select('sections.name as section_name')
      .count('* as count')
      .groupBy('student_attendances.date', 'classes.name', 'sections.name')
      .orderBy('student_attendances.date', 'desc')
      .limit(5)

    const recentAttendanceMarked = recentMarked.map((r) => ({
      date: DateTime.fromJSDate(r.date).toISODate()!,
      className: r.class_name,
      sectionName: r.section_name || null,
      markedCount: Number(r.count),
    }))

    return {
      profile: {
        staffMemberId: staff.staffMemberId,
        name: staff.fullName,
        department: staff.department?.name || null,
        designation: staff.designation?.name || null,
      },
      assignments: {
        total: assignments.length,
        classTeacherOf,
        subjects,
      },
      todayClasses: subjects, // Simplified - would need timetable for actual today's classes
      attendance: { myClassesToday },
      recentAttendanceMarked,
    }
  }

}

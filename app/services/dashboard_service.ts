import Student from '#models/student'
import Staff from '#models/staff_member'
import SchoolClass from '#models/school_class'
import StudentAttendance from '#models/student_attendance'
import StaffAttendance from '#models/staff_attendance'
import TeacherAssignment from '#models/teacher_assignment'
import AcademicYear from '#models/academic_year'
import SchoolSubscription from '#models/school_subscription'
import Roles from '#enums/roles'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'

export default class DashboardService {
  static async getSchoolAdminStats(schoolId: string) {
    const today = DateTime.now()
    const startOfMonth = today.startOf('month')
    const startOfWeek = today.startOf('week')

    const [studentStats, staffStats, classStats, attendanceStats, feeStats, subscriptionStats] =
      await Promise.all([
        this.getStudentStats(schoolId, startOfMonth),
        this.getStaffStats(schoolId),
        this.getClassStats(schoolId),
        this.getAttendanceStats(schoolId, today, startOfWeek),
        this.getFeeStats(schoolId),
        this.getSubscriptionStats(schoolId),
      ])

    return {
      students: studentStats,
      staff: staffStats,
      classes: classStats,
      attendance: attendanceStats,
      fees: feeStats,
      subscription: subscriptionStats,
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

    const teacherRow = await db
      .from('staff_members')
      .join('school_users', (query) => {
        query
          .on('staff_members.user_id', 'school_users.user_id')
          .andOnVal('school_users.school_id', schoolId)
          .andOnVal('school_users.role_id', Roles.TEACHER)
      })
      .where('staff_members.school_id', schoolId)
      .where('staff_members.status', 'active')
      .count('* as count')
      .first()

    const teachersCount = Number(teacherRow?.count ?? 0)
    const supportCount = active - teachersCount

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

    return { total, active, teachersCount, supportCount, departments }
  }

  private static async getClassStats(schoolId: string) {
    const classes = await SchoolClass.query().where('schoolId', schoolId).withCount('sections')

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
    const todayStaffAbsent = totalStaff - staffPresent

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
      todayStaffAbsent,
      weeklyTrend,
    }
  }

  private static async getFeeStats(schoolId: string) {
    const today = DateTime.now()
    const todayStr = today.toISODate()!
    const startOfMonth = today.startOf('month').toISODate()!
    const startOfPrevMonth = today.minus({ months: 1 }).startOf('month').toISODate()!
    const endOfPrevMonth = today.startOf('month').minus({ days: 1 }).toISODate()!
    const fourteenDaysAgo = today.minus({ days: 13 }).toISODate()!
    const priorWindowStart = today.minus({ days: 27 }).toISODate()!
    const priorWindowEnd = today.minus({ days: 14 }).toISODate()!

    const [todayRow, monthRow, prevMonthRow, trendRows, priorRow] = await Promise.all([
      db.from('fee_payments')
        .where('school_id', schoolId)
        .where('is_cancelled', false)
        .whereRaw('payment_date = ?', [todayStr])
        .select(db.raw('COALESCE(SUM(amount), 0) as total'))
        .count('* as count')
        .first(),

      db.from('fee_payments')
        .where('school_id', schoolId)
        .where('is_cancelled', false)
        .whereRaw('payment_date >= ?', [startOfMonth])
        .whereRaw('payment_date <= ?', [todayStr])
        .select(db.raw('COALESCE(SUM(amount), 0) as total'))
        .first(),

      db.from('fee_payments')
        .where('school_id', schoolId)
        .where('is_cancelled', false)
        .whereRaw('payment_date >= ?', [startOfPrevMonth])
        .whereRaw('payment_date <= ?', [endOfPrevMonth])
        .select(db.raw('COALESCE(SUM(amount), 0) as total'))
        .first(),

      db.from('fee_payments')
        .where('school_id', schoolId)
        .where('is_cancelled', false)
        .whereRaw('payment_date >= ?', [fourteenDaysAgo])
        .whereRaw('payment_date <= ?', [todayStr])
        .select('payment_date')
        .select(db.raw('COALESCE(SUM(amount), 0) as amount'))
        .groupBy('payment_date')
        .orderBy('payment_date'),

      db.from('fee_payments')
        .where('school_id', schoolId)
        .where('is_cancelled', false)
        .whereRaw('payment_date >= ?', [priorWindowStart])
        .whereRaw('payment_date <= ?', [priorWindowEnd])
        .select(db.raw('COALESCE(SUM(amount), 0) as total'))
        .first(),
    ])

    const trendMap = new Map<string, number>()
    for (const row of trendRows) {
      trendMap.set(DateTime.fromJSDate(row.payment_date).toISODate()!, Number(row.amount))
    }

    const trend = Array.from({ length: 14 }, (_, i) => {
      const date = today.minus({ days: 13 - i }).toISODate()!
      return { date, amount: trendMap.get(date) ?? 0 }
    })

    const trendTotal = trend.reduce((sum, d) => sum + d.amount, 0)
    const trendAvgPerDay = Math.round(trendTotal / 14)
    const priorTotal = Number(priorRow?.total ?? 0)
    const trendChangePercent =
      priorTotal > 0 ? Math.round(((trendTotal - priorTotal) / priorTotal) * 100) : 0

    return {
      todayAmount: Number(todayRow?.total ?? 0),
      todayPaymentCount: Number(todayRow?.count ?? 0),
      monthAmount: Number(monthRow?.total ?? 0),
      previousMonthAmount: Number(prevMonthRow?.total ?? 0),
      trend,
      trendTotal,
      trendAvgPerDay,
      trendChangePercent,
    }
  }

  private static async getSubscriptionStats(schoolId: string) {
    const sub = await SchoolSubscription.query()
      .where('schoolId', schoolId)
      .whereIn('status', ['active', 'trial'])
      .preload('plan')
      .orderBy('createdAt', 'desc')
      .first()

    if (!sub) return null

    const maxStudents = sub.maxStudents ?? sub.plan?.maxStudents ?? 0
    const maxStaff = sub.maxStaff ?? sub.plan?.maxStaff ?? 0
    const planName = sub.plan?.name ?? 'Custom'
    const daysRemaining = sub.endDate
      ? Math.max(0, Math.ceil(sub.endDate.diff(DateTime.now(), 'days').days))
      : null

    return {
      planName,
      status: sub.status,
      maxStudents,
      maxStaff,
      expiryDate: sub.endDate?.toISODate() ?? null,
      daysRemaining,
    }
  }

  static async getTeacherStats(schoolId: string, staffMemberId: string) {
    const today = DateTime.now()

    const staff = await Staff.query()
      .where('id', staffMemberId)
      .where('schoolId', schoolId)
      .preload('department')
      .preload('designation')
      .firstOrFail()

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

    const todayStr = today.toISODate()!
    const myClassesToday: { className: string; sectionName: string | null; present: number; absent: number; total: number; rate: number }[] = []

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
      todayClasses: subjects,
      attendance: { myClassesToday },
      recentAttendanceMarked,
    }
  }
}

export type SchoolAdminDashboardStats = {
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
    teachersCount: number // staff linked to school_users with role TEACHER
    supportCount: number  // active - teachersCount
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
    todayStaffAbsent: number
    weeklyTrend: { date: string; rate: number }[]
  }
  fees: {
    todayAmount: number
    todayPaymentCount: number
    monthAmount: number
    previousMonthAmount: number // for % change label — not a "target"
    trend: { date: string; amount: number }[] // last 14 days, ISO dates
    trendTotal: number
    trendAvgPerDay: number
    trendChangePercent: number // vs prior 14 days
  }
  subscription: {
    planName: string     // plan.name or 'Custom' if planId is null
    status: string
    maxStudents: number  // resolved: sub.maxStudents ?? plan.maxStudents
    maxStaff: number
    expiryDate: string | null  // ISO date or null if open-ended
    daysRemaining: number | null
  } | null
}

export type CanSeeFlags = {
  fees: boolean
  subscription: boolean
  attendance: boolean
  staff: boolean
}

export type TeacherDashboardStats = {
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

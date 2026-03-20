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

export type PrincipalDashboardStats = {
  overview: {
    totalStudents: number
    activeStudents: number
    totalStaff: number
    activeStaff: number
    totalClasses: number
    totalSections: number
  }
  attendance: {
    studentAttendanceRate: number
    staffAttendanceRate: number
    weeklyTrend: { date: string; studentRate: number; staffRate: number }[]
    lowAttendanceClasses: {
      className: string
      sectionName: string | null
      rate: number
      totalStudents: number
    }[]
  }
  academics: {
    classPerformance: {
      className: string
      averageScore: number
      passRate: number
    }[]
    topPerformers: {
      studentName: string
      className: string
      averageScore: number
    }[]
    subjectPerformance: {
      subject: string
      averageScore: number
      passRate: number
    }[]
  }
  staffMetrics: {
    departmentDistribution: { department: string; count: number }[]
    teacherStudentRatio: number
    averageExperience: number
  }
  alerts: {
    type: 'warning' | 'info' | 'success'
    message: string
    date: string
  }[]
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

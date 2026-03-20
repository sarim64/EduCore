export interface ClassAttendanceSummary {
  classId: string
  className: string
  sectionId: string | null
  sectionName: string | null
  totalStudents: number
  present: number
  absent: number
  late: number
  excused: number
  halfDay: number
  attendanceRate: number
}

export interface AttendanceSummaryReport {
  date: string
  schoolId: string
  totalClasses: number
  totalStudents: number
  overallAttendanceRate: number
  classes: ClassAttendanceSummary[]
}

export interface StaffAttendanceSummary {
  date: string
  totalStaff: number
  present: number
  absent: number
  late: number
  onLeave: number
  halfDay: number
  attendanceRate: number
}

export interface MonthlyStaffAttendanceRecord {
  staffMemberId: string
  staffName: string
  staffIdNumber: string
  department: string | null
  present: number
  absent: number
  late: number
  onLeave: number
  halfDay: number
  totalDays: number
  attendanceRate: number
}

export interface MonthlyStaffAttendanceReport {
  month: string
  year: number
  totalStaff: number
  workingDays: number
  averageAttendanceRate: number
  records: MonthlyStaffAttendanceRecord[]
}

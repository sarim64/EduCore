export type LeaveType = {
  id: string
  name: string
  code: string
  description?: string | null
  allowedDays?: number
  isPaid?: boolean
  isActive?: boolean
  appliesTo?: 'all' | 'teaching' | 'non_teaching'
}

export type LeaveStaff = {
  id: string
  firstName: string
  lastName: string | null
  staffMemberId?: string
  email?: string | null
}

export type LeaveApplication = {
  id: string
  startDate: string
  endDate: string
  totalDays: number
  reason: string
  status: 'pending' | 'approved' | 'rejected' | 'cancelled'
  appliedOn: string
  reviewedAt: string | null
  reviewerRemarks: string | null
  staff: LeaveStaff | null
  leaveType: LeaveType | null
  reviewedBy?: { id: string; fullName: string } | null
}

export type AttendanceEntry = {
  studentId: string
  status: 'present' | 'absent' | 'late' | 'excused' | 'half_day'
  remarks: string
}

export type AttendanceHistoryRecord = {
  id: string
  date: string
  status: string
  remarks: string | null
}

export type StaffAttendanceEntry = {
  staffMemberId: string
  status: 'present' | 'absent' | 'late' | 'on_leave' | 'half_day'
  checkInTime: string
  checkOutTime: string
  remarks: string
}

export type StaffAttendanceHistoryRecord = {
  id: string
  date: string
  status: string
  checkInTime: string | null
  checkOutTime: string | null
  remarks: string | null
}

export type CalendarDay = {
  date: string
  dayOfWeek: number
  status: 'present' | 'absent' | 'late' | 'excused' | 'half_day' | 'holiday' | 'no_data'
  count?: {
    present: number
    absent: number
    late: number
    excused: number
    halfDay: number
    total: number
  }
}

export type CalendarData = {
  month: string
  year: number
  days: CalendarDay[]
  summary: {
    totalWorkingDays: number
    averageAttendance: number
  }
}

export type AttendanceRecord = {
  date: string
  status: string
  remarks: string | null
}

export type StudentReport = {
  studentId: string
  studentName: string
  studentIdNumber: string
  className: string
  sectionName: string | null
  fromDate: string
  toDate: string
  totalDays: number
  present: number
  absent: number
  late: number
  excused: number
  halfDay: number
  attendanceRate: number
  records: AttendanceRecord[]
}

export type ClassSummary = {
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

export type StudentAttendanceSummary = {
  date: string
  schoolId: string
  totalClasses: number
  totalStudents: number
  overallAttendanceRate: number
  classes: ClassSummary[]
}

export type StaffAttendanceSummary = {
  date: string
  totalStaff: number
  present: number
  absent: number
  late: number
  onLeave: number
  halfDay: number
  attendanceRate: number
}

export type DailyRecord = {
  studentId: string
  studentName: string
  studentIdNumber: string
  status: string
  remarks: string | null
}

export type DailyReport = {
  date: string
  className: string
  sectionName: string | null
  totalStudents: number
  present: number
  absent: number
  late: number
  excused: number
  halfDay: number
  attendanceRate: number
  records: DailyRecord[]
}

export type MonthlyRecord = {
  studentId: string
  studentName: string
  studentIdNumber: string
  present: number
  absent: number
  late: number
  excused: number
  halfDay: number
  totalDays: number
  attendanceRate: number
}

export type MonthlyReport = {
  month: string
  year: number
  className: string
  sectionName: string | null
  totalStudents: number
  workingDays: number
  averageAttendanceRate: number
  records: MonthlyRecord[]
}

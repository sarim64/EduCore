export interface DailyAttendanceRecord {
  studentId: string
  studentName: string
  studentIdNumber: string
  status: string
  remarks: string | null
}

export interface DailyAttendanceReport {
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
  records: DailyAttendanceRecord[]
}

export interface MonthlyStudentRecord {
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

export interface MonthlyAttendanceReport {
  month: string
  year: number
  className: string
  sectionName: string | null
  totalStudents: number
  workingDays: number
  averageAttendanceRate: number
  records: MonthlyStudentRecord[]
}

export interface StudentAttendanceRecord {
  date: string
  status: string
  remarks: string | null
}

export interface StudentAttendanceReport {
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
  records: StudentAttendanceRecord[]
}

export interface CalendarDay {
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

export interface CalendarViewData {
  month: string
  year: number
  days: CalendarDay[]
  summary: {
    totalWorkingDays: number
    averageAttendance: number
  }
}

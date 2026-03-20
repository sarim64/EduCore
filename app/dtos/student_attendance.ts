import { BaseModelDto } from '@adocasts.com/dto/base'
import StudentAttendance from '#models/student_attendance'
import StudentDto from '#dtos/student'

export default class StudentAttendanceDto extends BaseModelDto {
  declare id: string
  declare schoolId: string
  declare studentId: string
  declare academicYearId: string
  declare classId: string | null
  declare sectionId: string | null
  declare markedById: string | null
  declare date: string
  declare status: string
  declare remarks: string | null
  declare createdAt: string
  declare updatedAt: string | null
  declare student: StudentDto | null

  constructor(attendance?: StudentAttendance) {
    super()

    if (!attendance) return
    this.id = attendance.id
    this.schoolId = attendance.schoolId
    this.studentId = attendance.studentId
    this.academicYearId = attendance.academicYearId
    this.classId = attendance.classId
    this.sectionId = attendance.sectionId
    this.markedById = attendance.markedById
    this.date = attendance.date.toISODate()!
    this.status = attendance.status
    this.remarks = attendance.remarks
    this.createdAt = attendance.createdAt.toISO()!
    this.updatedAt = attendance.updatedAt?.toISO() ?? null
    this.student = attendance.student ? new StudentDto(attendance.student) : null
  }
}

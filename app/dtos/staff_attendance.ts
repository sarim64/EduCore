import { BaseModelDto } from '@adocasts.com/dto/base'
import StaffAttendance from '#models/staff_attendance'
import StaffMemberDto from '#dtos/staff_member'

export default class StaffAttendanceDto extends BaseModelDto {
  declare id: string
  declare schoolId: string
  declare staffMemberId: string
  declare markedById: string | null
  declare date: string
  declare status: string
  declare checkInTime: string | null
  declare checkOutTime: string | null
  declare remarks: string | null
  declare createdAt: string
  declare updatedAt: string | null
  declare staffMember: StaffMemberDto | null

  constructor(attendance?: StaffAttendance) {
    super()

    if (!attendance) return
    this.id = attendance.id
    this.schoolId = attendance.schoolId
    this.staffMemberId = attendance.staffMemberId
    this.markedById = attendance.markedById
    this.date = attendance.date.toISODate()!
    this.status = attendance.status
    this.checkInTime = attendance.checkInTime
    this.checkOutTime = attendance.checkOutTime
    this.remarks = attendance.remarks
    this.createdAt = attendance.createdAt.toISO()!
    this.updatedAt = attendance.updatedAt?.toISO() ?? null
    this.staffMember = attendance.staffMember ? new StaffMemberDto(attendance.staffMember) : null
  }
}

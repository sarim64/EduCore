import { BaseModelDto } from '@adocasts.com/dto/base'
import LeaveApplication from '#models/leave_application'
import StaffMemberDto from '#dtos/staff_member'
import LeaveTypeDto from '#dtos/leave_type'

export default class LeaveApplicationDto extends BaseModelDto {
  declare id: string
  declare schoolId: string
  declare staffMemberId: string
  declare leaveTypeId: string
  declare reviewedById: string | null
  declare startDate: string
  declare endDate: string
  declare totalDays: number
  declare reason: string
  declare status: string
  declare appliedOn: string
  declare reviewedAt: string | null
  declare reviewerRemarks: string | null
  declare createdAt: string
  declare updatedAt: string | null
  declare staffMember: StaffMemberDto | null
  declare leaveType: LeaveTypeDto | null

  constructor(application?: LeaveApplication) {
    super()

    if (!application) return
    this.id = application.id
    this.schoolId = application.schoolId
    this.staffMemberId = application.staffMemberId
    this.leaveTypeId = application.leaveTypeId
    this.reviewedById = application.reviewedById
    this.startDate = application.startDate.toISODate()!
    this.endDate = application.endDate.toISODate()!
    this.totalDays = application.totalDays
    this.reason = application.reason
    this.status = application.status
    this.appliedOn = application.appliedOn.toISODate()!
    this.reviewedAt = application.reviewedAt?.toISO() ?? null
    this.reviewerRemarks = application.reviewerRemarks
    this.createdAt = application.createdAt.toISO()!
    this.updatedAt = application.updatedAt?.toISO() ?? null
    this.staffMember = application.staffMember ? new StaffMemberDto(application.staffMember) : null
    this.leaveType = application.leaveType ? new LeaveTypeDto(application.leaveType) : null
  }
}

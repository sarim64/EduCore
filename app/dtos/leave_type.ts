import { BaseModelDto } from '@adocasts.com/dto/base'
import LeaveType from '#models/leave_type'

export default class LeaveTypeDto extends BaseModelDto {
  declare id: string
  declare schoolId: string
  declare name: string
  declare code: string
  declare description: string | null
  declare allowedDays: number
  declare isPaid: boolean
  declare isActive: boolean
  declare appliesTo: 'all' | 'teaching' | 'non_teaching'
  declare createdAt: string
  declare updatedAt: string | null

  constructor(leaveType?: LeaveType) {
    super()

    if (!leaveType) return
    this.id = leaveType.id
    this.schoolId = leaveType.schoolId
    this.name = leaveType.name
    this.code = leaveType.code
    this.description = leaveType.description
    this.allowedDays = leaveType.allowedDays
    this.isPaid = leaveType.isPaid
    this.isActive = leaveType.isActive
    this.appliesTo = leaveType.appliesTo
    this.createdAt = leaveType.createdAt.toISO()!
    this.updatedAt = leaveType.updatedAt?.toISO() ?? null
  }
}

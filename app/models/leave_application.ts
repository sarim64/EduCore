import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import { compose } from '@adonisjs/core/helpers'
import { WithSchool } from './mixins/with_school.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import StaffMember from './staff_member.js'
import LeaveType from './leave_type.js'
import User from './user.js'

export type LeaveApplicationStatus = 'pending' | 'approved' | 'rejected' | 'cancelled'

export default class LeaveApplication extends compose(BaseModel, WithSchool) {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare staffMemberId: string

  @column()
  declare leaveTypeId: string

  @column()
  declare reviewedById: string | null

  @column.date()
  declare startDate: DateTime

  @column.date()
  declare endDate: DateTime

  @column()
  declare totalDays: number

  @column()
  declare reason: string

  @column()
  declare status: LeaveApplicationStatus

  @column.date()
  declare appliedOn: DateTime

  @column.dateTime()
  declare reviewedAt: DateTime | null

  @column()
  declare reviewerRemarks: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => StaffMember, { foreignKey: 'staffMemberId' })
  declare staffMember: BelongsTo<typeof StaffMember>

  @belongsTo(() => LeaveType)
  declare leaveType: BelongsTo<typeof LeaveType>

  @belongsTo(() => User, { foreignKey: 'reviewedById' })
  declare reviewedBy: BelongsTo<typeof User>

  get isPending() {
    return this.status === 'pending'
  }

  get isApproved() {
    return this.status === 'approved'
  }
}

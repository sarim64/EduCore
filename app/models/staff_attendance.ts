import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import { compose } from '@adonisjs/core/helpers'
import { WithSchool } from './mixins/with_school.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import StaffMember from './staff_member.js'
import User from './user.js'

export type StaffAttendanceStatus = 'present' | 'absent' | 'late' | 'on_leave' | 'half_day'

export default class StaffAttendance extends compose(BaseModel, WithSchool) {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare staffMemberId: string

  @column()
  declare markedById: string | null

  @column.date()
  declare date: DateTime

  @column()
  declare status: StaffAttendanceStatus

  @column()
  declare checkInTime: string | null

  @column()
  declare checkOutTime: string | null

  @column()
  declare remarks: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => StaffMember, { foreignKey: 'staffMemberId' })
  declare staffMember: BelongsTo<typeof StaffMember>

  @belongsTo(() => User, { foreignKey: 'markedById' })
  declare markedBy: BelongsTo<typeof User>
}

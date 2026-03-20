import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import StaffMember from './staff_member.js'

export default class StaffQualification extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare staffMemberId: string

  @column()
  declare degree: string

  @column()
  declare fieldOfStudy: string | null

  @column()
  declare institution: string

  @column()
  declare year: number

  @column()
  declare grade: string | null

  @column()
  declare certificateUrl: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  // Relationships
  @belongsTo(() => StaffMember, { foreignKey: 'staffMemberId' })
  declare staffMember: BelongsTo<typeof StaffMember>
}

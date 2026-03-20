import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import StaffMember from './staff_member.js'

export default class StaffDocument extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare staffMemberId: string

  @column()
  declare name: string

  @column()
  declare type: string

  @column()
  declare fileUrl: string

  @column()
  declare fileType: string | null

  @column()
  declare fileSize: number | null

  @column()
  declare notes: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  // Relationships
  @belongsTo(() => StaffMember, { foreignKey: 'staffMemberId' })
  declare staffMember: BelongsTo<typeof StaffMember>
}

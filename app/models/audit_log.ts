import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import School from './school.js'
import User from './user.js'

export default class AuditLog extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare schoolId: string | null

  @column()
  declare userId: string | null

  @column()
  declare action: string

  @column()
  declare entityType: string

  @column()
  declare entityId: string | null

  @column()
  declare oldValues: Record<string, unknown> | null

  @column()
  declare newValues: Record<string, unknown> | null

  @column()
  declare ipAddress: string | null

  @column()
  declare userAgent: string | null

  @column()
  declare description: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @belongsTo(() => School)
  declare school: BelongsTo<typeof School>

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}

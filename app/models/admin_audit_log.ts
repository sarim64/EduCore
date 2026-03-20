import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import SuperAdmin from './super_admin.js'
import School from './school.js'
import User from './user.js'

export default class AdminAuditLog extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare superAdminId: string

  @column()
  declare action: string

  @column()
  declare entityType: string

  @column()
  declare entityId: string

  @column()
  declare targetSchoolId: string | null

  @column()
  declare targetUserId: string | null

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

  @belongsTo(() => SuperAdmin)
  declare superAdmin: BelongsTo<typeof SuperAdmin>

  @belongsTo(() => School, { foreignKey: 'targetSchoolId' })
  declare targetSchool: BelongsTo<typeof School>

  @belongsTo(() => User, { foreignKey: 'targetUserId' })
  declare targetUser: BelongsTo<typeof User>
}

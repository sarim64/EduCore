import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import AdminAuditLog from './admin_audit_log.js'

export default class SuperAdmin extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare userId: string

  @column()
  declare grantedByUserId: string | null

  @column.dateTime()
  declare grantedAt: DateTime

  @column()
  declare revokedByUserId: string | null

  @column.dateTime()
  declare revokedAt: DateTime | null

  @column()
  declare notes: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => User, { foreignKey: 'grantedByUserId' })
  declare grantedByUser: BelongsTo<typeof User>

  @belongsTo(() => User, { foreignKey: 'revokedByUserId' })
  declare revokedByUser: BelongsTo<typeof User>

  @hasMany(() => AdminAuditLog)
  declare auditLogs: HasMany<typeof AdminAuditLog>

  get isActive() {
    return this.revokedAt === null
  }
}

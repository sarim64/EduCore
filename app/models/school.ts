import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, hasOne, manyToMany } from '@adonisjs/lucid/orm'
import User from './user.js'
import type { HasMany, HasOne, ManyToMany } from '@adonisjs/lucid/types/relations'
import SchoolInvite from './school_invite.js'
import SchoolSubscription from './school_subscription.js'
import AuditLog from './audit_log.js'

export default class School extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @column()
  declare code: string | null

  @column()
  declare address: string | null

  @column()
  declare phone: string | null

  @column()
  declare city: string | null

  @column()
  declare province: string | null

  @column()
  declare isSuspended: boolean

  @column()
  declare logoUrl: string | null

  @column()
  declare settings: Record<string, unknown>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => SchoolInvite)
  declare invites: HasMany<typeof SchoolInvite>

  @hasOne(() => SchoolSubscription, {
    onQuery: (query) => query.where('status', 'active').orderBy('start_date', 'desc'),
  })
  declare subscription: HasOne<typeof SchoolSubscription>

  @hasMany(() => SchoolSubscription)
  declare subscriptions: HasMany<typeof SchoolSubscription>

  @hasMany(() => AuditLog)
  declare auditLogs: HasMany<typeof AuditLog>

  @manyToMany(() => User, {
    pivotTable: 'school_users',
    pivotColumns: ['role_id'],
  })
  declare users: ManyToMany<typeof User>
}

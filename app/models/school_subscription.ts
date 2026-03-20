import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import School from './school.js'
import SubscriptionPlan from './subscription_plan.js'
import User from './user.js'

export default class SchoolSubscription extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare schoolId: string

  @column()
  declare planId: string | null

  @column()
  declare status: string

  @column.date()
  declare startDate: DateTime

  @column.date()
  declare endDate: DateTime | null

  @column()
  declare maxStudents: number | null

  @column()
  declare maxStaff: number | null

  @column()
  declare customPrice: number | null

  @column()
  declare notes: string | null

  @column()
  declare createdBy: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => School)
  declare school: BelongsTo<typeof School>

  @belongsTo(() => SubscriptionPlan, {
    foreignKey: 'planId',
  })
  declare plan: BelongsTo<typeof SubscriptionPlan>

  @belongsTo(() => User, {
    foreignKey: 'createdBy',
  })
  declare creator: BelongsTo<typeof User>

  get isExpired(): boolean {
    if (!this.endDate) return false
    return this.endDate < DateTime.now()
  }
}

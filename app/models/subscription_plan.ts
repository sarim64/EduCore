import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import SchoolSubscription from './school_subscription.js'

export default class SubscriptionPlan extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @column()
  declare code: string

  @column()
  declare description: string | null

  @column({ consume: (value) => Number(value) })
  declare priceMonthly: number

  @column({ consume: (value) => Number(value) })
  declare priceYearly: number

  @column()
  declare maxStudents: number

  @column()
  declare maxStaff: number

  @column()
  declare isActive: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @hasMany(() => SchoolSubscription, {
    foreignKey: 'planId',
  })
  declare subscriptions: HasMany<typeof SchoolSubscription>
}

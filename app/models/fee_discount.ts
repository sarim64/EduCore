import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import { compose } from '@adonisjs/core/helpers'
import { WithSchool } from './mixins/with_school.js'
import FeeCategory from './fee_category.js'
import StudentDiscount from './student_discount.js'
import DiscountType from '#enums/discount_type'

export default class FeeDiscount extends compose(BaseModel, WithSchool) {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare feeCategoryId: string | null

  @column()
  declare name: string

  @column()
  declare code: string | null

  @column()
  declare description: string | null

  @column()
  declare discountType: DiscountType

  @column()
  declare value: number

  @column()
  declare criteria: string | null

  @column()
  declare maxBeneficiaries: number | null

  @column.date()
  declare validFrom: DateTime | null

  @column.date()
  declare validUntil: DateTime | null

  @column()
  declare isActive: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  // Relationships
  @belongsTo(() => FeeCategory)
  declare feeCategory: BelongsTo<typeof FeeCategory>

  @hasMany(() => StudentDiscount)
  declare studentDiscounts: HasMany<typeof StudentDiscount>
}

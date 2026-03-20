import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import { compose } from '@adonisjs/core/helpers'
import { WithSchool } from './mixins/with_school.js'
import FeeStructure from './fee_structure.js'
import FeeDiscount from './fee_discount.js'

export default class FeeCategory extends compose(BaseModel, WithSchool) {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @column()
  declare code: string | null

  @column()
  declare description: string | null

  @column()
  declare isMandatory: boolean

  @column()
  declare isActive: boolean

  @column()
  declare displayOrder: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  // Relationships
  @hasMany(() => FeeStructure)
  declare feeStructures: HasMany<typeof FeeStructure>

  @hasMany(() => FeeDiscount)
  declare discounts: HasMany<typeof FeeDiscount>
}

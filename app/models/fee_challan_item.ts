import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import FeeChallan from './fee_challan.js'
import FeeCategory from './fee_category.js'
import FeeStructure from './fee_structure.js'
import StudentDiscount from './student_discount.js'

export default class FeeChallanItem extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare feeChallanId: string

  @column()
  declare feeCategoryId: string

  @column()
  declare feeStructureId: string | null

  @column()
  declare studentDiscountId: string | null

  @column()
  declare amount: number

  @column()
  declare discountAmount: number

  @column()
  declare netAmount: number

  @column()
  declare description: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  // Relationships
  @belongsTo(() => FeeChallan)
  declare feeChallan: BelongsTo<typeof FeeChallan>

  @belongsTo(() => FeeCategory)
  declare feeCategory: BelongsTo<typeof FeeCategory>

  @belongsTo(() => FeeStructure)
  declare feeStructure: BelongsTo<typeof FeeStructure>

  @belongsTo(() => StudentDiscount)
  declare studentDiscount: BelongsTo<typeof StudentDiscount>
}

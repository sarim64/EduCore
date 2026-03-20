import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { compose } from '@adonisjs/core/helpers'
import { WithSchool } from './mixins/with_school.js'
import Student from './student.js'
import FeeDiscount from './fee_discount.js'
import AcademicYear from './academic_year.js'
import User from './user.js'
import DiscountType from '#enums/discount_type'

export default class StudentDiscount extends compose(BaseModel, WithSchool) {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare studentId: string

  @column()
  declare feeDiscountId: string

  @column()
  declare academicYearId: string

  @column()
  declare overrideDiscountType: DiscountType | null

  @column()
  declare overrideValue: number | null

  @column()
  declare remarks: string | null

  @column()
  declare approvedBy: string | null

  @column.dateTime()
  declare approvedAt: DateTime | null

  @column()
  declare isActive: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  // Relationships
  @belongsTo(() => Student)
  declare student: BelongsTo<typeof Student>

  @belongsTo(() => FeeDiscount)
  declare feeDiscount: BelongsTo<typeof FeeDiscount>

  @belongsTo(() => AcademicYear)
  declare academicYear: BelongsTo<typeof AcademicYear>

  @belongsTo(() => User, { foreignKey: 'approvedBy' })
  declare approver: BelongsTo<typeof User>

  // Computed: Get the effective discount type and value
  get effectiveDiscountType(): DiscountType {
    return this.overrideDiscountType ?? this.feeDiscount?.discountType ?? DiscountType.PERCENTAGE
  }

  get effectiveValue(): number {
    return this.overrideValue ?? this.feeDiscount?.value ?? 0
  }
}

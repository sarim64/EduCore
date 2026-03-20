import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { compose } from '@adonisjs/core/helpers'
import { WithSchool } from './mixins/with_school.js'
import AcademicYear from './academic_year.js'
import SchoolClass from './school_class.js'
import FeeCategory from './fee_category.js'
import FeeFrequency from '#enums/fee_frequency'

export default class FeeStructure extends compose(BaseModel, WithSchool) {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare academicYearId: string

  @column()
  declare classId: string

  @column()
  declare feeCategoryId: string

  @column()
  declare amount: number

  @column()
  declare frequency: FeeFrequency

  @column()
  declare lateFeeAmount: number

  @column()
  declare lateFeePercentage: number

  @column()
  declare gracePeriodDays: number

  @column()
  declare dueDayOfMonth: number

  @column()
  declare isActive: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  // Relationships
  @belongsTo(() => AcademicYear)
  declare academicYear: BelongsTo<typeof AcademicYear>

  @belongsTo(() => SchoolClass, { foreignKey: 'classId' })
  declare class: BelongsTo<typeof SchoolClass>

  @belongsTo(() => FeeCategory)
  declare feeCategory: BelongsTo<typeof FeeCategory>
}

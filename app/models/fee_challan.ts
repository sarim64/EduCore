import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import { compose } from '@adonisjs/core/helpers'
import { WithSchool } from './mixins/with_school.js'
import Student from './student.js'
import AcademicYear from './academic_year.js'
import Enrollment from './enrollment.js'
import User from './user.js'
import FeeChallanItem from './fee_challan_item.js'
import FeePayment from './fee_payment.js'
import ChallanStatus from '#enums/challan_status'

export default class FeeChallan extends compose(BaseModel, WithSchool) {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare studentId: string

  @column()
  declare academicYearId: string

  @column()
  declare enrollmentId: string | null

  @column()
  declare challanNumber: string

  @column()
  declare period: string

  @column.date()
  declare issueDate: DateTime

  @column.date()
  declare dueDate: DateTime

  @column()
  declare totalAmount: number

  @column()
  declare discountAmount: number

  @column()
  declare lateFeeAmount: number

  @column()
  declare netAmount: number

  @column()
  declare paidAmount: number

  @column()
  declare balanceAmount: number

  @column()
  declare status: ChallanStatus

  @column()
  declare lateFeeApplied: boolean

  @column.dateTime()
  declare lateFeeAppliedAt: DateTime | null

  @column()
  declare remarks: string | null

  @column()
  declare generatedBy: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  // Relationships
  @belongsTo(() => Student)
  declare student: BelongsTo<typeof Student>

  @belongsTo(() => AcademicYear)
  declare academicYear: BelongsTo<typeof AcademicYear>

  @belongsTo(() => Enrollment)
  declare enrollment: BelongsTo<typeof Enrollment>

  @belongsTo(() => User, { foreignKey: 'generatedBy' })
  declare generator: BelongsTo<typeof User>

  @hasMany(() => FeeChallanItem)
  declare items: HasMany<typeof FeeChallanItem>

  @hasMany(() => FeePayment)
  declare payments: HasMany<typeof FeePayment>

  // Computed properties
  get isPaid() {
    return this.status === ChallanStatus.PAID
  }

  get isOverdue() {
    return (
      this.status === ChallanStatus.OVERDUE ||
      (this.status === ChallanStatus.PENDING && this.dueDate < DateTime.now())
    )
  }

  get hasPartialPayment() {
    return this.paidAmount > 0 && this.balanceAmount > 0
  }
}

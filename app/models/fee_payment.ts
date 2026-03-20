import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { compose } from '@adonisjs/core/helpers'
import { WithSchool } from './mixins/with_school.js'
import FeeChallan from './fee_challan.js'
import Student from './student.js'
import User from './user.js'
import PaymentMethod from '#enums/payment_method'

export default class FeePayment extends compose(BaseModel, WithSchool) {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare feeChallanId: string

  @column()
  declare studentId: string

  @column()
  declare receiptNumber: string

  @column()
  declare amount: number

  @column()
  declare paymentMethod: PaymentMethod

  @column.date()
  declare paymentDate: DateTime

  @column()
  declare chequeNumber: string | null

  @column.date()
  declare chequeDate: DateTime | null

  @column()
  declare bankName: string | null

  @column()
  declare transactionReference: string | null

  @column()
  declare remarks: string | null

  @column()
  declare receivedBy: string | null

  @column()
  declare isCancelled: boolean

  @column()
  declare cancellationReason: string | null

  @column()
  declare cancelledBy: string | null

  @column.dateTime()
  declare cancelledAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  // Relationships
  @belongsTo(() => FeeChallan)
  declare feeChallan: BelongsTo<typeof FeeChallan>

  @belongsTo(() => Student)
  declare student: BelongsTo<typeof Student>

  @belongsTo(() => User, { foreignKey: 'receivedBy' })
  declare receiver: BelongsTo<typeof User>

  @belongsTo(() => User, { foreignKey: 'cancelledBy' })
  declare canceller: BelongsTo<typeof User>
}

import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import { compose } from '@adonisjs/core/helpers'
import { WithSchool } from './mixins/with_school.js'
import Designation from './designation.js'
import StaffMember from './staff_member.js'

export default class Department extends compose(BaseModel, WithSchool) {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @column()
  declare description: string | null

  @column()
  declare isActive: boolean

  @column()
  declare headId: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  // Relationships
  @belongsTo(() => StaffMember, { foreignKey: 'headId' })
  declare head: BelongsTo<typeof StaffMember>

  @hasMany(() => Designation)
  declare designations: HasMany<typeof Designation>

  @hasMany(() => StaffMember)
  declare staffMember: HasMany<typeof StaffMember>
}

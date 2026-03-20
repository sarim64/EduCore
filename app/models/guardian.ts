import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import { compose } from '@adonisjs/core/helpers'
import { WithSchool } from './mixins/with_school.js'
import Student from './student.js'

export default class Guardian extends compose(BaseModel, WithSchool) {
  @column({ isPrimary: true })
  declare id: string

  // Personal Information
  @column()
  declare firstName: string

  @column()
  declare lastName: string | null

  @column()
  declare relation: string

  // Contact Information
  @column()
  declare email: string | null

  @column()
  declare phone: string

  @column()
  declare alternatePhone: string | null

  @column()
  declare address: string | null

  @column()
  declare city: string | null

  @column()
  declare state: string | null

  @column()
  declare postalCode: string | null

  @column()
  declare country: string | null

  // Professional Information
  @column()
  declare occupation: string | null

  @column()
  declare workplace: string | null

  @column()
  declare workPhone: string | null

  // Identification
  @column()
  declare nationalId: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  // Relationships
  @manyToMany(() => Student, {
    pivotTable: 'student_guardians',
    pivotColumns: ['is_primary', 'is_emergency_contact', 'can_pickup'],
    pivotTimestamps: true,
  })
  declare students: ManyToMany<typeof Student>

  // Computed properties
  get fullName() {
    return `${this.firstName} ${this.lastName ?? ''}`.trim()
  }
}

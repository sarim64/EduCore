import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import type { HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import { compose } from '@adonisjs/core/helpers'
import { WithSchool } from './mixins/with_school.js'
import Guardian from './guardian.js'
import Enrollment from './enrollment.js'
import StudentDocument from './student_document.js'

export default class Student extends compose(BaseModel, WithSchool) {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare studentId: string

  // Personal Information
  @column()
  declare firstName: string

  @column()
  declare lastName: string | null

  @column.date()
  declare dateOfBirth: DateTime | null

  @column()
  declare gender: string | null

  @column()
  declare bloodGroup: string | null

  @column()
  declare religion: string | null

  @column()
  declare nationality: string | null

  // Contact Information
  @column()
  declare email: string | null

  @column()
  declare phone: string | null

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

  // Medical Information
  @column()
  declare medicalConditions: string | null

  @column()
  declare allergies: string | null

  @column()
  declare emergencyContactName: string | null

  @column()
  declare emergencyContactPhone: string | null

  // Academic Information
  @column.date()
  declare admissionDate: DateTime | null

  @column()
  declare previousSchool: string | null

  // Status
  @column()
  declare status: string

  // Photo
  @column()
  declare photoUrl: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  // Relationships
  @manyToMany(() => Guardian, {
    pivotTable: 'student_guardians',
    pivotColumns: ['is_primary', 'is_emergency_contact', 'can_pickup'],
    pivotTimestamps: true,
  })
  declare guardians: ManyToMany<typeof Guardian>

  @hasMany(() => Enrollment)
  declare enrollments: HasMany<typeof Enrollment>

  @hasMany(() => StudentDocument)
  declare documents: HasMany<typeof StudentDocument>

  // Computed properties
  get fullName() {
    return `${this.firstName} ${this.lastName ?? ''}`.trim()
  }

  get isActive() {
    return this.status === 'active'
  }
}

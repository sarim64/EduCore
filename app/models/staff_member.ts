import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import { compose } from '@adonisjs/core/helpers'
import { WithSchool } from './mixins/with_school.js'
import Department from './department.js'
import Designation from './designation.js'
import User from './user.js'
import StaffQualification from './staff_qualification.js'
import StaffDocument from './staff_document.js'
import TeacherAssignment from './teacher_assignment.js'

export default class StaffMember extends compose(BaseModel, WithSchool) {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare departmentId: string | null

  @column()
  declare designationId: string | null

  @column()
  declare userId: string | null

  // Staff ID (auto-generated business ID)
  @column()
  declare staffMemberId: string

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
  declare maritalStatus: string | null

  @column()
  declare nationality: string | null

  @column()
  declare nationalId: string | null

  // Contact Information
  @column()
  declare email: string | null

  @column()
  declare phone: string | null

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

  // Emergency Contact
  @column()
  declare emergencyContactName: string | null

  @column()
  declare emergencyContactPhone: string | null

  @column()
  declare emergencyContactRelation: string | null

  // Employment Details
  @column.date()
  declare joiningDate: DateTime | null

  @column()
  declare employmentType: string

  @column()
  declare basicSalary: number

  @column()
  declare bankName: string | null

  @column()
  declare bankAccountNumber: string | null

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
  @belongsTo(() => Department)
  declare department: BelongsTo<typeof Department>

  @belongsTo(() => Designation)
  declare designation: BelongsTo<typeof Designation>

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @hasMany(() => StaffQualification)
  declare qualifications: HasMany<typeof StaffQualification>

  @hasMany(() => StaffDocument)
  declare documents: HasMany<typeof StaffDocument>

  @hasMany(() => TeacherAssignment)
  declare teacherAssignments: HasMany<typeof TeacherAssignment>


  // Computed properties
  get fullName() {
    return `${this.firstName} ${this.lastName ?? ''}`.trim()
  }

  get isActive() {
    return this.status === 'active'
  }
}

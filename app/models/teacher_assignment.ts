import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { compose } from '@adonisjs/core/helpers'
import { WithSchool } from './mixins/with_school.js'
import StaffMember from './staff_member.js'
import AcademicYear from './academic_year.js'
import SchoolClass from './school_class.js'
import Section from './section.js'
import Subject from './subject.js'

export default class TeacherAssignment extends compose(BaseModel, WithSchool) {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare staffMemberId: string

  @column()
  declare academicYearId: string

  @column()
  declare classId: string

  @column()
  declare sectionId: string | null

  @column()
  declare subjectId: string

  @column()
  declare isClassTeacher: boolean

  @column()
  declare notes: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  // Relationships
  @belongsTo(() => StaffMember, { foreignKey: 'staffMemberId' })
  declare staffMember: BelongsTo<typeof StaffMember>

  @belongsTo(() => AcademicYear)
  declare academicYear: BelongsTo<typeof AcademicYear>

  @belongsTo(() => SchoolClass, { foreignKey: 'classId' })
  declare class: BelongsTo<typeof SchoolClass>

  @belongsTo(() => Section)
  declare section: BelongsTo<typeof Section>

  @belongsTo(() => Subject)
  declare subject: BelongsTo<typeof Subject>
}

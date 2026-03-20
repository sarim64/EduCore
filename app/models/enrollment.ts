import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { compose } from '@adonisjs/core/helpers'
import { WithSchool } from './mixins/with_school.js'
import Student from './student.js'
import AcademicYear from './academic_year.js'
import SchoolClass from './school_class.js'
import Section from './section.js'

export default class Enrollment extends compose(BaseModel, WithSchool) {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare studentId: string

  @column()
  declare academicYearId: string

  @column()
  declare classId: string

  @column()
  declare sectionId: string | null

  @column()
  declare rollNumber: string | null

  @column.date()
  declare enrollmentDate: DateTime

  @column()
  declare status: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  // Relationships
  @belongsTo(() => Student)
  declare student: BelongsTo<typeof Student>

  @belongsTo(() => AcademicYear)
  declare academicYear: BelongsTo<typeof AcademicYear>

  @belongsTo(() => SchoolClass, {
    foreignKey: 'classId',
  })
  declare class: BelongsTo<typeof SchoolClass>

  @belongsTo(() => Section)
  declare section: BelongsTo<typeof Section>
}

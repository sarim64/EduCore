import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import { compose } from '@adonisjs/core/helpers'
import { WithSchool } from './mixins/with_school.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Student from './student.js'
import AcademicYear from './academic_year.js'
import SchoolClass from './school_class.js'
import Section from './section.js'
import User from './user.js'

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused' | 'half_day'

export default class StudentAttendance extends compose(BaseModel, WithSchool) {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare studentId: string

  @column()
  declare academicYearId: string

  @column()
  declare classId: string | null

  @column()
  declare sectionId: string | null

  @column()
  declare markedById: string | null

  @column.date()
  declare date: DateTime

  @column()
  declare status: AttendanceStatus

  @column()
  declare remarks: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => Student)
  declare student: BelongsTo<typeof Student>

  @belongsTo(() => AcademicYear)
  declare academicYear: BelongsTo<typeof AcademicYear>

  @belongsTo(() => SchoolClass, { foreignKey: 'classId' })
  declare class: BelongsTo<typeof SchoolClass>

  @belongsTo(() => Section)
  declare section: BelongsTo<typeof Section>

  @belongsTo(() => User, { foreignKey: 'markedById' })
  declare markedBy: BelongsTo<typeof User>
}

import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import { compose } from '@adonisjs/core/helpers'
import type { HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import { WithSchool } from './mixins/with_school.js'
import Section from './section.js'
import Subject from './subject.js'

export default class SchoolClass extends compose(BaseModel, WithSchool) {
  static table = 'classes'
  serializeExtras = true

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @column()
  declare code: string | null

  @column()
  declare displayOrder: number

  @column()
  declare description: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @hasMany(() => Section, {
    foreignKey: 'classId',
  })
  declare sections: HasMany<typeof Section>

  @manyToMany(() => Subject, {
    pivotTable: 'class_subjects',
    pivotForeignKey: 'class_id',
    pivotRelatedForeignKey: 'subject_id',
    pivotColumns: ['periods_per_week', 'is_mandatory'],
    pivotTimestamps: true,
  })
  declare subjects: ManyToMany<typeof Subject>
}

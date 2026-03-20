import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import { compose } from '@adonisjs/core/helpers'
import { WithSchool } from './mixins/with_school.js'
import SchoolClass from './school_class.js'

export default class Subject extends compose(BaseModel, WithSchool) {
  serializeExtras = true

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @column()
  declare code: string | null

  @column()
  declare description: string | null

  @column()
  declare isElective: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @manyToMany(() => SchoolClass, {
    pivotTable: 'class_subjects',
    pivotForeignKey: 'subject_id',
    pivotRelatedForeignKey: 'class_id',
    pivotColumns: ['periods_per_week', 'is_mandatory'],
    pivotTimestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  })
  declare classes: ManyToMany<typeof SchoolClass>
}

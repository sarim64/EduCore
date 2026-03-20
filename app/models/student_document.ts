import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import { compose } from '@adonisjs/core/helpers'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { WithSchool } from './mixins/with_school.js'
import Student from './student.js'

export default class StudentDocument extends compose(BaseModel, WithSchool) {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare studentId: string

  @column()
  declare name: string

  @column()
  declare type: string

  @column()
  declare filePath: string

  @column()
  declare fileName: string

  @column()
  declare mimeType: string | null

  @column()
  declare fileSize: number | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  // Relationships
  @belongsTo(() => Student)
  declare student: BelongsTo<typeof Student>
}

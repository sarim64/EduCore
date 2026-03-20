import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class ModuleDefinition extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare key: string

  @column()
  declare name: string

  @column()
  declare description: string | null

  @column()
  declare isBasic: boolean

  @column()
  declare displayOrder: number

  @column()
  declare icon: string | null

  @column({
    prepare: (value: string[]) => JSON.stringify(value),
    consume: (value: string | string[]) =>
      typeof value === 'string' ? JSON.parse(value) : (value ?? []),
  })
  declare dependencies: string[]

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}

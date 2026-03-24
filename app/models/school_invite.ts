import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import Role from './role.js'
import { compose } from '@adonisjs/core/helpers'
import { WithSchool } from './mixins/with_school.js'

export default class SchoolInvite extends compose(BaseModel, WithSchool) {
  static table = 'school_invites'

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare invitedByUserId: string

  @column()
  declare cancelledByUserId: string | null

  @column()
  declare email: string

  @column()
  declare roleId: number

  @column()
  declare token: string | null

  @column.dateTime()
  declare expiresAt: DateTime | null

  @column.dateTime()
  declare acceptedAt: DateTime | null

  @column.dateTime()
  declare cancelledAt: DateTime | null

  get isPending(): boolean {
    return (
      !this.acceptedAt &&
      !this.cancelledAt &&
      !!this.expiresAt &&
      this.expiresAt > DateTime.now()
    )
  }

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User, {
    foreignKey: 'invitedByUserId',
  })
  declare invitedByUser: BelongsTo<typeof User>

  @belongsTo(() => User, {
    foreignKey: 'cancelledByUserId',
  })
  declare cancelledByUser: BelongsTo<typeof User>

  @belongsTo(() => Role)
  declare role: BelongsTo<typeof Role>
}

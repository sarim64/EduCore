import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, hasMany, hasOne, manyToMany } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import PasswordResetToken from './password_reset_token.js'
import type { HasMany, HasOne, ManyToMany } from '@adonisjs/lucid/types/relations'
import School from './school.js'
import SuperAdmin from './super_admin.js'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare firstName: string

  @column()
  declare lastName: string | null

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare mustSetPassword: boolean

  get fullName(): string {
    return [this.firstName, this.lastName].filter(Boolean).join(' ')
  }

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @hasMany(() => PasswordResetToken)
  declare passwordResetTokens: HasMany<typeof PasswordResetToken>

  @manyToMany(() => School, {
    pivotTable: 'school_users',
    pivotColumns: ['role_id'],
  })
  declare schools: ManyToMany<typeof School>

  @hasOne(() => SuperAdmin)
  declare superAdmin: HasOne<typeof SuperAdmin>
}

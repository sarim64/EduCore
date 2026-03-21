import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'school_invites'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('token', 64).unique().nullable()
      table.timestamp('expires_at').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('token')
      table.dropColumn('expires_at')
    })
  }
}

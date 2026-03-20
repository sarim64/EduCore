import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'super_admins'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)
      table.uuid('user_id').references('users.id').onDelete('CASCADE').unique().notNullable()
      table.uuid('granted_by_user_id').references('users.id').onDelete('SET NULL')
      table.timestamp('granted_at').notNullable()
      table.uuid('revoked_by_user_id').references('users.id').onDelete('SET NULL')
      table.timestamp('revoked_at')
      table.text('notes')
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

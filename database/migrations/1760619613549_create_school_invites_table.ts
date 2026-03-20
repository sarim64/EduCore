import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'school_invites'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)
      table.uuid('school_id').references('schools.id').onDelete('CASCADE').notNullable()
      table.uuid('invited_by_user_id').references('users.id').onDelete('CASCADE').notNullable()
      table.uuid('cancelled_by_user_id').references('users.id').onDelete('SET NULL')
      table.string('email', 254).notNullable()
      table.integer('role_id').references('roles.id').onDelete('CASCADE').notNullable()

      table.timestamp('accepted_at')
      table.timestamp('cancelled_at')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

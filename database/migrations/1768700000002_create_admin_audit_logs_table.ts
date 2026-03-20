import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'admin_audit_logs'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)
      table.uuid('super_admin_id').references('super_admins.id').onDelete('CASCADE').notNullable()
      table
        .string('action', 50)
        .notNullable()
        .comment('create_school, update_school, delete_school, add_admin, remove_admin')
      table.string('entity_type', 50).notNullable()
      table.uuid('entity_id').notNullable()
      table.uuid('target_school_id').references('schools.id').onDelete('SET NULL')
      table.uuid('target_user_id').references('users.id').onDelete('SET NULL')
      table.jsonb('old_values')
      table.jsonb('new_values')
      table.string('ip_address', 45)
      table.text('user_agent')
      table.text('description')
      table.timestamp('created_at').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

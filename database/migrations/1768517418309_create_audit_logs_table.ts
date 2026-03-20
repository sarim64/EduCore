import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'audit_logs'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)
      table.uuid('school_id').references('schools.id').onDelete('CASCADE')
      table.uuid('user_id').references('users.id').onDelete('SET NULL')
      table.string('action', 50).notNullable() // e.g., 'create', 'update', 'delete', 'login', 'logout'
      table.string('entity_type', 100).notNullable() // e.g., 'Student', 'Staff', 'FeePayment'
      table.uuid('entity_id') // ID of the affected entity
      table.jsonb('old_values') // Previous values (for updates)
      table.jsonb('new_values') // New values (for creates/updates)
      table.string('ip_address', 45) // IPv4 or IPv6
      table.text('user_agent')
      table.text('description') // Human-readable description

      table.timestamp('created_at').notNullable()

      // Index for efficient querying
      table.index(['school_id', 'created_at'])
      table.index(['entity_type', 'entity_id'])
      table.index(['user_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

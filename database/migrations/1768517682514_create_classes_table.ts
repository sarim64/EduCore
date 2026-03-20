import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'classes'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)
      table.uuid('school_id').references('schools.id').onDelete('CASCADE').notNullable()
      table.string('name', 50).notNullable() // e.g., "Grade 1", "Class 10"
      table.string('code', 20) // e.g., "G1", "C10"
      table.integer('display_order').defaultTo(0)
      table.text('description')

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at')

      // Unique class name per school
      table.unique(['school_id', 'name'])

      // Performance indexes
      table.index(['school_id', 'display_order']) // For sorted listings
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

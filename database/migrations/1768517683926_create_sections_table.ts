import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'sections'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)
      table.uuid('school_id').references('schools.id').onDelete('CASCADE').notNullable()
      table.uuid('class_id').references('classes.id').onDelete('CASCADE').notNullable()
      table.string('name', 20).notNullable() // e.g., "A", "B", "C"
      table.integer('capacity').defaultTo(40)
      table.string('room_number', 20)

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at')

      // Unique section name per class
      table.unique(['class_id', 'name'])

      // Performance indexes
      table.index(['class_id']) // For class → sections lookup
      table.index(['school_id']) // For school-wide section queries
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'school_modules'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)
      table.uuid('school_id').references('schools.id').onDelete('CASCADE').notNullable()
      table.string('module_key', 50).notNullable() // e.g., 'attendance', 'timetable', 'fees', 'payroll'
      table.boolean('is_enabled').defaultTo(true)
      table.jsonb('settings').defaultTo('{}') // Module-specific settings

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at')

      // Unique constraint: one module per school
      table.unique(['school_id', 'module_key'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

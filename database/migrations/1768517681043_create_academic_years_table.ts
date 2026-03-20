import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'academic_years'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)
      table.uuid('school_id').references('schools.id').onDelete('CASCADE').notNullable()
      table.string('name', 50).notNullable() // e.g., "2024-2025"
      table.date('start_date').notNullable()
      table.date('end_date').notNullable()
      table.boolean('is_current').defaultTo(false)

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at')

      // Unique academic year name per school
      table.unique(['school_id', 'name'])

      // Performance indexes
      table.index(['school_id', 'start_date']) // For date range queries
    })

    // Partial unique index: only one current academic year per school
    this.schema.raw(`
      CREATE UNIQUE INDEX academic_years_school_current_unique
      ON academic_years (school_id)
      WHERE is_current = true
    `)
  }

  async down() {
    this.schema.raw('DROP INDEX IF EXISTS academic_years_school_current_unique')
    this.schema.dropTable(this.tableName)
  }
}

import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'subjects'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)
      table.uuid('school_id').references('schools.id').onDelete('CASCADE').notNullable()
      table.string('name', 100).notNullable() // e.g., "Mathematics", "English"
      table.string('code', 20) // e.g., "MATH", "ENG"
      table.text('description')
      table.boolean('is_elective').defaultTo(false)

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at')

      // Unique subject name per school
      table.unique(['school_id', 'name'])
      // Unique subject code per school (if provided)
      table.unique(['school_id', 'code'])

      // Performance indexes
      table.index(['school_id', 'is_elective']) // For filtering
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

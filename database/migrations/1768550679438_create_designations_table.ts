import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'designations'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)

      // Foreign keys
      table.uuid('school_id').references('schools.id').onDelete('CASCADE').notNullable()
      table.uuid('department_id').references('departments.id').onDelete('CASCADE').notNullable()

      // Designation info
      table.string('name', 100).notNullable()
      table.text('description')
      table.boolean('is_active').defaultTo(true)

      // Timestamps
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at')

      // Unique constraint: designation name per department
      table.unique(['department_id', 'name'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

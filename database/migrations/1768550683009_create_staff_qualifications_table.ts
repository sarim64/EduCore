import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'staff_qualifications'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)

      // Foreign key
      table.uuid('staff_member_id').references('staff_members.id').onDelete('CASCADE').notNullable()

      // Qualification info
      table.string('degree', 150).notNullable() // e.g., "Bachelor of Science", "Master of Education"
      table.string('field_of_study', 150) // e.g., "Computer Science", "Mathematics"
      table.string('institution', 200).notNullable()
      table.integer('year').notNullable()
      table.string('grade', 20) // e.g., "A", "3.8 GPA", "First Class"
      table.string('certificate_url', 500) // Document upload

      // Timestamps
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'student_guardians'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)

      // Foreign keys
      table.uuid('student_id').references('students.id').onDelete('CASCADE').notNullable()
      table.uuid('guardian_id').references('guardians.id').onDelete('CASCADE').notNullable()

      // Relationship flags
      table.boolean('is_primary').defaultTo(false) // Primary contact
      table.boolean('is_emergency_contact').defaultTo(false)
      table.boolean('can_pickup').defaultTo(true) // Can pick up student from school

      // Timestamps
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at')

      // Unique constraint: one student-guardian pair
      table.unique(['student_id', 'guardian_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

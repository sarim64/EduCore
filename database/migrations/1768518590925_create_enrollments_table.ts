import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'enrollments'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)

      // Foreign keys
      table.uuid('school_id').references('schools.id').onDelete('CASCADE').notNullable()
      table.uuid('student_id').references('students.id').onDelete('CASCADE').notNullable()
      table
        .uuid('academic_year_id')
        .references('academic_years.id')
        .onDelete('CASCADE')
        .notNullable()
      table.uuid('class_id').references('classes.id').onDelete('CASCADE').notNullable()
      table.uuid('section_id').references('sections.id').onDelete('SET NULL')

      // Enrollment details
      table.string('roll_number', 20)
      table.date('enrollment_date').notNullable()
      table.string('status', 20).defaultTo('active') // active, promoted, transferred, dropped

      // Timestamps
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at')

      // Unique constraint: one enrollment per student per academic year
      table.unique(['student_id', 'academic_year_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'student_attendances'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)

      table.uuid('school_id').references('schools.id').onDelete('CASCADE').notNullable()
      table.uuid('student_id').references('students.id').onDelete('CASCADE').notNullable()
      table
        .uuid('academic_year_id')
        .references('academic_years.id')
        .onDelete('CASCADE')
        .notNullable()
      table.uuid('class_id').references('classes.id').onDelete('SET NULL')
      table.uuid('section_id').references('sections.id').onDelete('SET NULL')
      table.uuid('marked_by_id').references('users.id').onDelete('SET NULL')

      table.date('date').notNullable()
      table.string('status', 20).notNullable() // 'present', 'absent', 'late', 'excused', 'half_day'
      table.text('remarks')

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at')

      table.unique(['school_id', 'student_id', 'date'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

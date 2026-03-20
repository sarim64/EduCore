import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'teacher_assignments'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)

      // Foreign keys
      table.uuid('school_id').references('schools.id').onDelete('CASCADE').notNullable()
      table.uuid('staff_member_id').references('staff_members.id').onDelete('CASCADE').notNullable()
      table
        .uuid('academic_year_id')
        .references('academic_years.id')
        .onDelete('CASCADE')
        .notNullable()
      table.uuid('class_id').references('classes.id').onDelete('CASCADE').notNullable()
      table.uuid('section_id').references('sections.id').onDelete('CASCADE')
      table.uuid('subject_id').references('subjects.id').onDelete('CASCADE').notNullable()

      // Assignment details
      table.boolean('is_class_teacher').defaultTo(false)
      table.text('notes')

      // Timestamps
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at')

      // Unique constraint: one teacher per class/section/subject per year
      table.unique(['academic_year_id', 'class_id', 'section_id', 'subject_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

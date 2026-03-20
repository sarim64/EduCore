import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'student_discounts'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)

      // Foreign keys
      table.uuid('school_id').references('schools.id').onDelete('CASCADE').notNullable()
      table.uuid('student_id').references('students.id').onDelete('CASCADE').notNullable()
      table.uuid('fee_discount_id').references('fee_discounts.id').onDelete('CASCADE').notNullable()
      table
        .uuid('academic_year_id')
        .references('academic_years.id')
        .onDelete('CASCADE')
        .notNullable()

      // Override values (optional - if set, overrides the discount default)
      table.string('override_discount_type', 20) // percentage or fixed
      table.decimal('override_value', 14, 2)

      // Remarks/reason for assignment
      table.text('remarks')

      // Approved by
      table.uuid('approved_by').references('users.id').onDelete('SET NULL')
      table.timestamp('approved_at')

      // Status
      table.boolean('is_active').defaultTo(true)

      // Timestamps
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at')

      // Unique constraint: one discount per student per academic year
      table.unique(['student_id', 'fee_discount_id', 'academic_year_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'fee_structures'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)

      // Foreign keys
      table.uuid('school_id').references('schools.id').onDelete('CASCADE').notNullable()
      table
        .uuid('academic_year_id')
        .references('academic_years.id')
        .onDelete('CASCADE')
        .notNullable()
      table.uuid('class_id').references('classes.id').onDelete('CASCADE').notNullable()
      table
        .uuid('fee_category_id')
        .references('fee_categories.id')
        .onDelete('CASCADE')
        .notNullable()

      // Fee amount details
      table.decimal('amount', 14, 2).notNullable()
      table.string('frequency', 20).notNullable().defaultTo('monthly') // monthly, quarterly, yearly, one_time

      // Late fee settings
      table.decimal('late_fee_amount', 14, 2).defaultTo(0)
      table.decimal('late_fee_percentage', 5, 2).defaultTo(0)
      table.integer('grace_period_days').defaultTo(0) // days after due date before late fee applies

      // Due date settings
      table.integer('due_day_of_month').defaultTo(10) // e.g., 10th of each month

      // Status
      table.boolean('is_active').defaultTo(true)

      // Timestamps
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at')

      // Unique constraint: one fee structure per class/category/year
      table.unique(['academic_year_id', 'class_id', 'fee_category_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'fee_challan_items'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)

      // Foreign keys
      table.uuid('fee_challan_id').references('fee_challans.id').onDelete('CASCADE').notNullable()
      table
        .uuid('fee_category_id')
        .references('fee_categories.id')
        .onDelete('CASCADE')
        .notNullable()
      table.uuid('fee_structure_id').references('fee_structures.id').onDelete('SET NULL')
      table.uuid('student_discount_id').references('student_discounts.id').onDelete('SET NULL')

      // Amounts
      table.decimal('amount', 14, 2).notNullable() // Base amount from fee structure
      table.decimal('discount_amount', 14, 2).defaultTo(0)
      table.decimal('net_amount', 14, 2).notNullable() // amount - discount

      // Description (for manual adjustments or custom fees)
      table.string('description', 255)

      // Timestamps
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

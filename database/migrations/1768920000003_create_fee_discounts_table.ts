import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'fee_discounts'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)

      // Foreign keys
      table.uuid('school_id').references('schools.id').onDelete('CASCADE').notNullable()
      table.uuid('fee_category_id').references('fee_categories.id').onDelete('SET NULL') // null means applies to all categories

      // Discount details
      table.string('name', 100).notNullable()
      table.string('code', 20)
      table.text('description')

      // Discount type and value
      table.string('discount_type', 20).notNullable().defaultTo('percentage') // percentage or fixed
      table.decimal('value', 14, 2).notNullable() // percentage (e.g., 10.00 for 10%) or fixed amount

      // Eligibility criteria
      table.string('criteria', 50) // sibling, merit, staff_child, scholarship, etc.
      table.integer('max_beneficiaries') // null = unlimited

      // Validity period
      table.date('valid_from')
      table.date('valid_until')

      // Status
      table.boolean('is_active').defaultTo(true)

      // Timestamps
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at')

      // Unique constraint: one code per school
      table.unique(['school_id', 'code'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

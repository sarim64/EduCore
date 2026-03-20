import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'fee_categories'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)

      // Foreign keys
      table.uuid('school_id').references('schools.id').onDelete('CASCADE').notNullable()
      table.uuid('income_account_id').nullable()

      // Category details
      table.string('name', 100).notNullable()
      table.string('code', 20)
      table.text('description')

      // Settings
      table.boolean('is_mandatory').defaultTo(false)
      table.boolean('is_active').defaultTo(true)
      table.integer('display_order').defaultTo(0)

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

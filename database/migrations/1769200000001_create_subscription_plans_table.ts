import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'subscription_plans'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)

      table.string('name', 100).notNullable()
      table.string('code', 50).notNullable().unique()
      table.text('description')
      table.decimal('price_monthly', 10, 2).defaultTo(0)
      table.decimal('price_yearly', 10, 2).defaultTo(0)
      table.integer('max_students').defaultTo(-1)
      table.integer('max_staff').defaultTo(-1)
      table.jsonb('included_modules').defaultTo('[]')
      table.boolean('is_active').defaultTo(true)

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

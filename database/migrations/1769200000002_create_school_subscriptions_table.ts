import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'school_subscriptions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)

      table.uuid('school_id').references('schools.id').onDelete('CASCADE').notNullable().unique()
      table.uuid('plan_id').references('subscription_plans.id').onDelete('SET NULL')
      table.string('status', 20).notNullable().defaultTo('active')
      table.date('start_date').notNullable()
      table.date('end_date')
      table.integer('max_students')
      table.integer('max_staff')
      table.decimal('custom_price', 10, 2)
      table.text('notes')
      table.uuid('created_by').references('users.id').onDelete('SET NULL')

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

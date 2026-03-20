import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'module_definitions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)
      table.string('key', 50).notNullable().unique()
      table.string('name', 100).notNullable()
      table.text('description')
      table.boolean('is_basic').defaultTo(false)
      table.integer('display_order').defaultTo(0)
      table.string('icon', 50)
      table.jsonb('dependencies').defaultTo('[]')

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

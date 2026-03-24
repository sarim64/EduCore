import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'schools'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)
      table.string('name').notNullable()
      table.string('code', 30).unique()
      table.text('address')
      table.string('phone', 20)
      table.string('city')
      table.string('province')
      table.boolean('is_suspended').defaultTo(false)
      table.string('logo_url', 500)
      table.jsonb('settings').defaultTo('{}')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

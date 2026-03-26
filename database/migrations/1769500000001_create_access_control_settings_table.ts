import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.createTable('access_control_settings', (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)
      table.uuid('school_id').notNullable().references('id').inTable('schools').onDelete('CASCADE')
      table.integer('role_id').notNullable()
      table.string('permission', 100).notNullable()
      table.boolean('enabled').notNullable().defaultTo(false)
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').notNullable()
      table.unique(['school_id', 'role_id', 'permission'])
    })
  }

  async down() {
    this.schema.dropTable('access_control_settings')
  }
}

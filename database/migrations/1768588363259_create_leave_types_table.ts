import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'leave_types'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)

      table.uuid('school_id').references('schools.id').onDelete('CASCADE').notNullable()

      table.string('name', 100).notNullable()
      table.string('code', 20).notNullable()
      table.text('description')
      table.integer('allowed_days').defaultTo(0)
      table.boolean('is_paid').defaultTo(false)
      table.boolean('is_active').defaultTo(true)
      table.string('applies_to', 20).defaultTo('all') // 'all', 'teaching', 'non_teaching'

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at')

      table.unique(['school_id', 'code'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

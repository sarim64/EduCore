import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'staff_documents'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)

      // Foreign key
      table.uuid('staff_member_id').references('staff_members.id').onDelete('CASCADE').notNullable()

      // Document info
      table.string('name', 100).notNullable()
      table.string('type', 50).notNullable() // id_card, contract, resume, certificate, other
      table.string('file_url', 500).notNullable()
      table.string('file_type', 50) // pdf, jpg, png, doc
      table.integer('file_size') // in bytes
      table.text('notes')

      // Timestamps
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

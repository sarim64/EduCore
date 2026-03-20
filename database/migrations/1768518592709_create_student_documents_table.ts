import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'student_documents'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)

      // Foreign keys
      table.uuid('student_id').references('students.id').onDelete('CASCADE').notNullable()
      table.uuid('school_id').references('schools.id').onDelete('CASCADE').notNullable()

      // Document information
      table.string('name', 200).notNullable() // Document name/title
      table.string('type', 50).notNullable() // birth_certificate, transfer_certificate, medical_record, etc.
      table.string('file_path', 500).notNullable()
      table.string('file_name', 200).notNullable()
      table.string('mime_type', 100)
      table.integer('file_size') // in bytes

      // Timestamps
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

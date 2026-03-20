import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'guardians'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)

      // Foreign key
      table.uuid('school_id').references('schools.id').onDelete('CASCADE').notNullable()

      // Personal Information
      table.string('first_name', 100).notNullable()
      table.string('last_name', 100)
      table.string('relation', 50).notNullable() // father, mother, guardian, uncle, aunt, etc.

      // Contact Information
      table.string('email', 254)
      table.string('phone', 20).notNullable()
      table.string('alternate_phone', 20)
      table.text('address')
      table.string('city', 100)
      table.string('state', 100)
      table.string('postal_code', 20)
      table.string('country', 100)

      // Professional Information
      table.string('occupation', 100)
      table.string('workplace', 200)
      table.string('work_phone', 20)

      // Identification
      table.string('national_id', 50)

      // Timestamps
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

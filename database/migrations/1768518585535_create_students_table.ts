import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'students'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)

      // Foreign key
      table.uuid('school_id').references('schools.id').onDelete('CASCADE').notNullable()

      // Student ID (auto-generated business ID)
      table.string('student_id', 30).notNullable()

      // Personal Information
      table.string('first_name', 100).notNullable()
      table.string('last_name', 100)
      table.date('date_of_birth')
      table.string('gender', 10) // male, female, other
      table.string('blood_group', 5) // A+, A-, B+, B-, AB+, AB-, O+, O-
      table.string('religion', 50)
      table.string('nationality', 50)

      // Contact Information
      table.string('email', 254)
      table.string('phone', 20)
      table.text('address')
      table.string('city', 100)
      table.string('state', 100)
      table.string('postal_code', 20)
      table.string('country', 100)

      // Medical Information
      table.text('medical_conditions')
      table.text('allergies')
      table.string('emergency_contact_name', 100)
      table.string('emergency_contact_phone', 20)

      // Academic Information
      table.date('admission_date')
      table.string('previous_school', 200)

      // Status
      table.string('status', 20).defaultTo('active') // active, inactive, graduated, transferred, expelled

      // Photo
      table.string('photo_url', 500)

      // Timestamps
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at')

      // Unique constraint: student_id per school
      table.unique(['school_id', 'student_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

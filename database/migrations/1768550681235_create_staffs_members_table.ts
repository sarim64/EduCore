import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'staff_members'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)

      // Foreign keys
      table.uuid('school_id').references('schools.id').onDelete('CASCADE').notNullable()
      table.uuid('department_id').references('departments.id').onDelete('SET NULL')
      table.uuid('designation_id').references('designations.id').onDelete('SET NULL')
      table.uuid('user_id').references('users.id').onDelete('SET NULL') // Link to user account

      // Staff ID (auto-generated business ID)
      table.string('staff_member_id', 30).notNullable()

      // Personal Information
      table.string('first_name', 100).notNullable()
      table.string('last_name', 100)
      table.date('date_of_birth')
      table.string('gender', 10) // male, female, other
      table.string('blood_group', 5)
      table.string('marital_status', 20) // single, married, divorced, widowed
      table.string('nationality', 50)
      table.string('national_id', 50) // CNIC/SSN/etc.

      // Contact Information
      table.string('email', 254)
      table.string('phone', 20)
      table.string('alternate_phone', 20)
      table.text('address')
      table.string('city', 100)
      table.string('state', 100)
      table.string('postal_code', 20)
      table.string('country', 100)

      // Emergency Contact
      table.string('emergency_contact_name', 100)
      table.string('emergency_contact_phone', 20)
      table.string('emergency_contact_relation', 50)

      // Employment Details
      table.date('joining_date')
      table.string('employment_type', 20).defaultTo('full_time') // full_time, part_time, contract, temporary
      table.decimal('basic_salary', 12, 2).defaultTo(0)
      table.string('bank_name', 100)
      table.string('bank_account_number', 50)

      // Status
      table.string('status', 20).defaultTo('active') // active, on_leave, terminated, resigned, retired

      // Photo
      table.string('photo_url', 500)

      // Timestamps
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at')

      // Unique constraints
      table.unique(['school_id', 'staff_member_id'])
      table.unique(['school_id', 'email'])
      table.unique(['school_id', 'national_id'])
    })

    // Add head_id to departments now that staff table exists
    this.schema.alterTable('departments', (table) => {
      table.uuid('head_id').references('id').inTable('staff_members').onDelete('SET NULL')
    })
  }

  async down() {
    // Remove head_id from departments first
    this.schema.alterTable('departments', (table) => {
      table.dropColumn('head_id')
    })

    this.schema.dropTable(this.tableName)
  }
}

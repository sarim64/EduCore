import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'fee_payments'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)

      // Foreign keys
      table.uuid('school_id').references('schools.id').onDelete('CASCADE').notNullable()
      table.uuid('fee_challan_id').references('fee_challans.id').onDelete('CASCADE').notNullable()
      table.uuid('student_id').references('students.id').onDelete('CASCADE').notNullable()
      table.uuid('bank_account_id').nullable()
      table.uuid('journal_entry_id').nullable()

      // Receipt identification
      table.string('receipt_number', 50).notNullable()

      // Payment details
      table.decimal('amount', 14, 2).notNullable()
      table.string('payment_method', 20).notNullable() // cash, bank_transfer, cheque, online, card
      table.date('payment_date').notNullable()

      // Payment method specific details
      table.string('cheque_number', 50)
      table.date('cheque_date')
      table.string('bank_name', 100)
      table.string('transaction_reference', 100) // for online/card payments

      // Notes
      table.text('remarks')

      // Received by
      table.uuid('received_by').references('users.id').onDelete('SET NULL')

      // Cancellation
      table.boolean('is_cancelled').defaultTo(false)
      table.text('cancellation_reason')
      table.uuid('cancelled_by').references('users.id').onDelete('SET NULL')
      table.timestamp('cancelled_at')

      // Timestamps
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at')

      // Unique receipt number per school
      table.unique(['school_id', 'receipt_number'])

      // Indexes for faster queries
      table.index(['school_id', 'payment_date'])
      table.index(['student_id', 'payment_date'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

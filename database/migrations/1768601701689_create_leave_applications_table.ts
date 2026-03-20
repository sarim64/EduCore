import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'leave_applications'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)

      table.uuid('school_id').references('schools.id').onDelete('CASCADE').notNullable()
      table.uuid('staff_member_id').references('staff_members.id').onDelete('CASCADE').notNullable()
      table.uuid('leave_type_id').references('leave_types.id').onDelete('RESTRICT').notNullable()
      table.uuid('reviewed_by_id').references('users.id').onDelete('SET NULL')

      table.date('start_date').notNullable()
      table.date('end_date').notNullable()
      table.integer('total_days').notNullable()
      table.text('reason').notNullable()

      table.string('status', 20).defaultTo('pending') // 'pending', 'approved', 'rejected', 'cancelled'

      table.date('applied_on').notNullable()
      table.timestamp('reviewed_at')
      table.text('reviewer_remarks')

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

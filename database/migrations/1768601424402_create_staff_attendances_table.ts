import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'staff_attendances'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)

      table.uuid('school_id').references('schools.id').onDelete('CASCADE').notNullable()
      table.uuid('staff_member_id').references('staff_members.id').onDelete('CASCADE').notNullable()
      table.uuid('marked_by_id').references('users.id').onDelete('SET NULL')

      table.date('date').notNullable()
      table.string('status', 20).notNullable() // 'present', 'absent', 'late', 'on_leave', 'half_day'
      table.time('check_in_time')
      table.time('check_out_time')
      table.text('remarks')

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at')

      table.unique(['school_id', 'staff_member_id', 'date'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

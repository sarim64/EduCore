import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'class_subjects'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)
      table.uuid('school_id').references('schools.id').onDelete('CASCADE').notNullable()
      table.uuid('class_id').references('classes.id').onDelete('CASCADE').notNullable()
      table.uuid('subject_id').references('subjects.id').onDelete('CASCADE').notNullable()
      table.integer('periods_per_week').defaultTo(1)
      table.boolean('is_mandatory').defaultTo(true)

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at')

      // Unique subject per class
      table.unique(['class_id', 'subject_id'])

      // Performance indexes
      table.index(['class_id']) // For subject lookup by class
      table.index(['subject_id']) // For class lookup by subject
      table.index(['school_id']) // For multi-tenancy queries
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

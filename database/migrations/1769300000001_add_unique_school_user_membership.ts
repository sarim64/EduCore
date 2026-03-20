import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'school_users'

  async up() {
    // Remove duplicate memberships, keeping the most recent row.
    this.schema.raw(`
      DELETE FROM school_users su
      USING (
        SELECT id
        FROM (
          SELECT
            id,
            ROW_NUMBER() OVER (
              PARTITION BY school_id, user_id
              ORDER BY created_at DESC NULLS LAST, id DESC
            ) AS rn
          FROM school_users
        ) ranked
        WHERE ranked.rn > 1
      ) duplicates
      WHERE su.id = duplicates.id
    `)

    this.schema.alterTable(this.tableName, (table) => {
      table.unique(['school_id', 'user_id'], 'school_users_school_id_user_id_unique')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropUnique(['school_id', 'user_id'], 'school_users_school_id_user_id_unique')
    })
  }
}

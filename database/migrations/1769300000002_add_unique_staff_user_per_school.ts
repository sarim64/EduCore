import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'staff_members'

  async up() {
    // Remove duplicate staff links for the same user within a school.
    // Keeps most recently updated/created row and leaves unlinked rows untouched.
    this.schema.raw(`
      DELETE FROM staff_members sm
      USING (
        SELECT id
        FROM (
          SELECT
            id,
            ROW_NUMBER() OVER (
              PARTITION BY school_id, user_id
              ORDER BY updated_at DESC NULLS LAST, created_at DESC NULLS LAST, id DESC
            ) AS rn
          FROM staff_members
          WHERE user_id IS NOT NULL
        ) ranked
        WHERE ranked.rn > 1
      ) duplicates
      WHERE sm.id = duplicates.id
    `)

    this.schema.raw(`
      CREATE UNIQUE INDEX staff_members_school_id_user_id_unique
      ON staff_members (school_id, user_id)
      WHERE user_id IS NOT NULL
    `)
  }

  async down() {
    this.schema.raw('DROP INDEX IF EXISTS staff_members_school_id_user_id_unique')
  }
}

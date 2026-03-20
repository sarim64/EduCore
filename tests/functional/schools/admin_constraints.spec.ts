import { test } from '@japa/runner'
import db from '@adonisjs/lucid/services/db'
import { SchoolFactory } from '../../factories/school_factory.js'
import { UserFactory } from '../../factories/user_factory.js'
import { SuperAdminFactory } from '../../factories/super_admin_factory.js'
import Roles from '#enums/roles'

test.group('schools: admin constraints', () => {
  // Verifies that creating a school automatically assigns at least one admin.
  test('school creation assigns at least one admin', async ({ assert }) => {
    const school = await SchoolFactory.create()

    const users = await db.from('school_users').where('school_id', school.id)
    const hasAdmin = users.some((u) => u.role_id === Roles.SCHOOL_ADMIN)

    assert.isTrue(hasAdmin, 'School must have at least one admin')
  })

  // Ensures that application logic prevents removing the last admin from a school.
  test('cannot remove last admin via application logic', async ({ client, assert }) => {
    const superAdmin = await UserFactory.create()
    await SuperAdminFactory.merge({ userId: superAdmin.id }).create()
    const school = await SchoolFactory.create()

    // Ensure exactly one admin exists
    const admins = await db
      .from('school_users')
      .where('school_id', school.id)
      .andWhere('role_id', Roles.SCHOOL_ADMIN)
    assert.lengthOf(admins, 1)

    const response = await client
      .delete(`/admin/schools/${school.id}/admins/${admins[0].user_id}`)
      .loginAs(superAdmin)
      .withCsrfToken()

    // Should block removal of last admin
    response.assertRedirectsTo(`/admin/schools/${school.id}/admins`)

    const usersAfter = await db.from('school_users').where('school_id', school.id)
    const hasAdmin = usersAfter.some((u) => u.role_id === Roles.SCHOOL_ADMIN)
    assert.isTrue(hasAdmin, 'Cannot remove the last admin from a school')
  })
})

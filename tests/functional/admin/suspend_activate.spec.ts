import { test } from '@japa/runner'
import { UserFactory } from '../../factories/user_factory.js'
import { SuperAdminFactory } from '../../factories/super_admin_factory.js'
import { SchoolFactory } from '../../factories/school_factory.js'
import AdminAuditLog from '#models/admin_audit_log'

test.group('admin/schools - suspend and activate', () => {
  // Verifies super admin can suspend a school
  test('super admin can suspend a school', async ({ client, assert }) => {
    const user = await UserFactory.create()
    await SuperAdminFactory.merge({ userId: user.id }).create()
    const school = await SchoolFactory.create()

    const response = await client
      .post(`/admin/schools/${school.id}/suspend`)
      .loginAs(user)
      .withCsrfToken()

    response.assertRedirectsTo(`/admin/schools/${school.id}`)

    await school.refresh()
    assert.isTrue(school.isSuspended)
  })

  // Verifies suspend creates an audit log entry
  test('suspending a school creates an audit log entry', async ({ client, assert }) => {
    const user = await UserFactory.create()
    await SuperAdminFactory.merge({ userId: user.id }).create()
    const school = await SchoolFactory.create()

    await client
      .post(`/admin/schools/${school.id}/suspend`)
      .loginAs(user)
      .withCsrfToken()

    const auditLog = await AdminAuditLog.query()
      .where('entityId', school.id)
      .where('action', 'suspend')
      .first()
    assert.exists(auditLog)
  })

  // Verifies super admin can activate a suspended school
  test('super admin can activate a suspended school', async ({ client, assert }) => {
    const user = await UserFactory.create()
    await SuperAdminFactory.merge({ userId: user.id }).create()
    const school = await SchoolFactory.create()
    school.isSuspended = true
    await school.save()

    const response = await client
      .post(`/admin/schools/${school.id}/activate`)
      .loginAs(user)
      .withCsrfToken()

    response.assertRedirectsTo(`/admin/schools/${school.id}`)

    await school.refresh()
    assert.isFalse(school.isSuspended)
  })

  // Verifies activate creates an audit log entry
  test('activating a school creates an audit log entry', async ({ client, assert }) => {
    const user = await UserFactory.create()
    await SuperAdminFactory.merge({ userId: user.id }).create()
    const school = await SchoolFactory.create()
    school.isSuspended = true
    await school.save()

    await client
      .post(`/admin/schools/${school.id}/activate`)
      .loginAs(user)
      .withCsrfToken()

    const auditLog = await AdminAuditLog.query()
      .where('entityId', school.id)
      .where('action', 'activate')
      .first()
    assert.exists(auditLog)
  })

  // Verifies non-super-admin cannot suspend a school
  test('non-super-admin cannot suspend a school', async ({ client }) => {
    const user = await UserFactory.create()
    const school = await SchoolFactory.create()

    const response = await client
      .post(`/admin/schools/${school.id}/suspend`)
      .loginAs(user)
      .withCsrfToken()

    response.assertStatus(403)
  })

  // Verifies non-super-admin cannot activate a school
  test('non-super-admin cannot activate a school', async ({ client }) => {
    const user = await UserFactory.create()
    const school = await SchoolFactory.create()

    const response = await client
      .post(`/admin/schools/${school.id}/activate`)
      .loginAs(user)
      .withCsrfToken()

    response.assertStatus(403)
  })
})

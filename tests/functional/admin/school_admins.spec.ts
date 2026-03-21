import { test } from '@japa/runner'
import { UserFactory } from '../../factories/user_factory.js'
import { SuperAdminFactory } from '../../factories/super_admin_factory.js'
import { SchoolFactory } from '../../factories/school_factory.js'
import User from '#models/user'
import AdminAuditLog from '#models/admin_audit_log'
import Roles from '#enums/roles'
import mail from '@adonisjs/mail/services/main'

test.group('admin/school_admins', () => {
  // Verifies that super admin can view school admins list
  test('super admin can view school admins list', async ({ client }) => {
    const user = await UserFactory.create()
    await SuperAdminFactory.merge({ userId: user.id }).create()
    const school = await SchoolFactory.create()

    const response = await client
      .get(`/admin/schools/${school.id}/admins`)
      .loginAs(user)
      .withInertia()

    response.assertStatus(200)
    response.assertInertiaComponent('superadmin/schools/admins/index')
  })

  // Verifies that super admin can view add admin form
  test('super admin can view add admin form', async ({ client }) => {
    const user = await UserFactory.create()
    await SuperAdminFactory.merge({ userId: user.id }).create()
    const school = await SchoolFactory.create()

    const response = await client
      .get(`/admin/schools/${school.id}/admins/create`)
      .loginAs(user)
      .withInertia()

    response.assertStatus(200)
    response.assertInertiaComponent('superadmin/schools/admins/create')
  })

  // Verifies that super admin can add a new user as school admin,
  // that the user is created with mustSetPassword = true, and that a welcome email is sent.
  test('super admin can add a new user as school admin', async ({ client, assert, cleanup }) => {
    const { messages } = mail.fake()
    cleanup(() => mail.restore())

    const user = await UserFactory.create()
    await SuperAdminFactory.merge({ userId: user.id }).create()
    const school = await SchoolFactory.create()

    const response = await client
      .post(`/admin/schools/${school.id}/admins`)
      .loginAs(user)
      .withCsrfToken()
      .form({
        email: 'newadmin@school.com',
        firstName: 'New',
        lastName: 'Admin',
      })

    response.assertRedirectsTo(`/admin/schools/${school.id}/admins`)

    const newAdmin = await User.findBy('email', 'newadmin@school.com')
    assert.exists(newAdmin)
    assert.isTrue(newAdmin?.mustSetPassword, 'New admin must have mustSetPassword = true')

    await school.load('users', (query) => {
      query.wherePivot('role_id', Roles.SCHOOL_ADMIN)
    })
    const isAdmin = school.users.some((u) => u.id === newAdmin?.id)
    assert.isTrue(isAdmin)

    // Verify audit log was created
    const auditLog = await AdminAuditLog.query()
      .where('action', 'add_admin')
      .where('targetUserId', newAdmin?.id || '')
      .first()
    assert.exists(auditLog)

    // Verify welcome email was sent
    const sent = messages.sent()
    assert.lengthOf(sent, 1, 'Exactly one welcome email should be sent')
    assert.equal(sent[0].nodeMailerMessage.to, newAdmin?.email)
  })

  // Verifies that super admin can add an existing user as school admin (no email sent for existing users)
  test('super admin can add an existing user as school admin', async ({ client, assert, cleanup }) => {
    const { messages } = mail.fake()
    cleanup(() => mail.restore())

    const user = await UserFactory.create()
    await SuperAdminFactory.merge({ userId: user.id }).create()
    const school = await SchoolFactory.create()
    const existingUser = await UserFactory.create()

    const response = await client
      .post(`/admin/schools/${school.id}/admins`)
      .loginAs(user)
      .withCsrfToken()
      .form({
        email: existingUser.email,
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
      })

    response.assertRedirectsTo(`/admin/schools/${school.id}/admins`)

    await school.load('users', (query) => {
      query.wherePivot('role_id', Roles.SCHOOL_ADMIN)
    })
    const isAdmin = school.users.some((u) => u.id === existingUser.id)
    assert.isTrue(isAdmin)

    // No welcome email for existing users
    assert.lengthOf(messages.queued(), 0, 'No email should be sent for existing users')
  })

  // Verifies that super admin can remove a school admin
  test('super admin can remove a school admin', async ({ client, assert }) => {
    const user = await UserFactory.create()
    await SuperAdminFactory.merge({ userId: user.id }).create()
    const school = await SchoolFactory.create()
    const adminUser = await UserFactory.create()

    // Add user as admin first
    await school.related('users').attach({
      [adminUser.id]: { role_id: Roles.SCHOOL_ADMIN },
    })

    const response = await client
      .delete(`/admin/schools/${school.id}/admins/${adminUser.id}`)
      .loginAs(user)
      .withCsrfToken()

    response.assertRedirectsTo(`/admin/schools/${school.id}/admins`)

    await school.load('users', (query) => {
      query.wherePivot('user_id', adminUser.id)
    })
    assert.equal(school.users.length, 0)

    // Verify audit log was created
    const auditLog = await AdminAuditLog.query()
      .where('action', 'remove_admin')
      .where('targetUserId', adminUser.id)
      .first()
    assert.exists(auditLog)
  })

  // Verifies that non-super-admin cannot manage school admins
  test('non-super-admin cannot manage school admins', async ({ client }) => {
    const user = await UserFactory.create()
    const school = await SchoolFactory.create()

    const response = await client.get(`/admin/schools/${school.id}/admins`).loginAs(user)

    response.assertStatus(403)
  })
})

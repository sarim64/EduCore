import { test } from '@japa/runner'
import { UserFactory } from '../../factories/user_factory.js'
import { SuperAdminFactory } from '../../factories/super_admin_factory.js'
import { SchoolFactory } from '../../factories/school_factory.js'
import School from '#models/school'
import AdminAuditLog from '#models/admin_audit_log'
import mail from '@adonisjs/mail/services/main'

test.group('admin/schools', () => {
  // Verifies that super admin can view the schools list
  test('super admin can view schools list', async ({ client }) => {
    const user = await UserFactory.create()
    await SuperAdminFactory.merge({ userId: user.id }).create()
    await SchoolFactory.create()

    const response = await client.get('/admin/schools').loginAs(user).withInertia()

    response.assertStatus(200)
    response.assertInertiaComponent('superadmin/schools/index')
  })

  // Verifies that super admin can view create school form
  test('super admin can view create school form', async ({ client }) => {
    const user = await UserFactory.create()
    await SuperAdminFactory.merge({ userId: user.id }).create()

    const response = await client.get('/admin/schools/create').loginAs(user).withInertia()

    response.assertStatus(200)
    response.assertInertiaComponent('superadmin/schools/create')
  })

  // Verifies that super admin can create a school
  test('super admin can create a school', async ({ client, assert }) => {
    const user = await UserFactory.create()
    await SuperAdminFactory.merge({ userId: user.id }).create()

    const response = await client.post('/admin/schools').loginAs(user).withCsrfToken().form({
      name: 'Test School',
      code: 'TST001',
      address: '123 Test St',
      phone: '123-456-7890',
    })

    response.assertRedirectsTo('/admin/schools')

    const school = await School.findBy('name', 'Test School')
    assert.exists(school)
    assert.equal(school?.code, 'TST001')

    // Verify audit log was created
    const auditLog = await AdminAuditLog.findBy('entityId', school?.id)
    assert.exists(auditLog)
    assert.equal(auditLog?.action, 'create_school')
  })

  // Verifies that super admin can create a school with initial admin
  test('super admin can create a school with initial admin', async ({ client, assert, cleanup }) => {
    const { messages } = mail.fake()
    cleanup(() => mail.restore())

    const user = await UserFactory.create()
    await SuperAdminFactory.merge({ userId: user.id }).create()

    const response = await client.post('/admin/schools').loginAs(user).withCsrfToken().form({
      name: 'School With Admin',
      adminEmail: 'admin@school.com',
      adminFirstName: 'Admin',
      adminLastName: 'User',
    })

    response.assertRedirectsTo('/admin/schools')

    const school = await School.query()
      .where('name', 'School With Admin')
      .preload('users')
      .firstOrFail()

    assert.equal(school.users.length, 1)
    assert.equal(school.users[0].email, 'admin@school.com')

    const sent = messages.sent()
    assert.lengthOf(sent, 1, 'Exactly one welcome email should be sent')
    assert.equal(sent[0].nodeMailerMessage.to, 'admin@school.com')
  })

  // Verifies that super admin can view a school
  test('super admin can view a school', async ({ client }) => {
    const user = await UserFactory.create()
    await SuperAdminFactory.merge({ userId: user.id }).create()
    const school = await SchoolFactory.create()

    const response = await client.get(`/admin/schools/${school.id}`).loginAs(user).withInertia()

    response.assertStatus(200)
    response.assertInertiaComponent('superadmin/schools/show')
  })

  // Verifies that super admin can view edit school form
  test('super admin can view edit school form', async ({ client }) => {
    const user = await UserFactory.create()
    await SuperAdminFactory.merge({ userId: user.id }).create()
    const school = await SchoolFactory.create()

    const response = await client
      .get(`/admin/schools/${school.id}/edit`)
      .loginAs(user)
      .withInertia()

    response.assertStatus(200)
    response.assertInertiaComponent('superadmin/schools/edit')
  })

  // Verifies that super admin can update a school
  test('super admin can update a school', async ({ client, assert }) => {
    const user = await UserFactory.create()
    await SuperAdminFactory.merge({ userId: user.id }).create()
    const school = await SchoolFactory.create()

    const response = await client
      .put(`/admin/schools/${school.id}`)
      .loginAs(user)
      .withCsrfToken()
      .form({
        name: 'Updated School Name',
      })

    response.assertRedirectsTo('/admin/schools')

    await school.refresh()
    assert.equal(school.name, 'Updated School Name')

    // Verify audit log was created
    const auditLog = await AdminAuditLog.query()
      .where('entityId', school.id)
      .where('action', 'update_school')
      .first()
    assert.exists(auditLog)
  })

  // Verifies that super admin can delete a school
  test('super admin can delete a school', async ({ client, assert }) => {
    const user = await UserFactory.create()
    await SuperAdminFactory.merge({ userId: user.id }).create()
    const school = await SchoolFactory.create()
    const schoolId = school.id

    const response = await client
      .delete(`/admin/schools/${school.id}`)
      .loginAs(user)
      .withCsrfToken()

    response.assertRedirectsTo('/admin/schools')

    const deletedSchool = await School.find(schoolId)
    assert.isNull(deletedSchool)

    // Verify audit log was created
    const auditLog = await AdminAuditLog.query()
      .where('entityId', schoolId)
      .where('action', 'delete_school')
      .first()
    assert.exists(auditLog)
  })

  // Verifies that non-super-admin cannot access school management
  test('non-super-admin cannot access school management', async ({ client }) => {
    const user = await UserFactory.create()

    const response = await client.get('/admin/schools').loginAs(user)

    response.assertStatus(403)
  })
})

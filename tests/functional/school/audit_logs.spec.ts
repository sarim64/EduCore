import { test } from '@japa/runner'
import { UserFactory } from '../../factories/user_factory.js'
import { SchoolFactory } from '../../factories/school_factory.js'
import AuditLog from '#models/audit_log'
import Roles from '#enums/roles'

test.group('school/audit-logs', (group) => {
  group.each.setup(async () => {
    // Clean up audit logs before each test for isolation
    await AuditLog.query().delete()
  })

  test('school admin can view audit logs page', async ({ client }) => {
    const school = await SchoolFactory.create()
    const user = await UserFactory.create()
    await school.related('users').attach({ [user.id]: { role_id: Roles.SCHOOL_ADMIN } })

    const response = await client
      .get('/audit-logs')
      .loginAs(user)
      .withSession({ schoolId: school.id })
      .withInertia()

    response.assertStatus(200)
    response.assertInertiaComponent('school/audit-logs/index')
  })

  test('principal cannot access audit logs', async ({ client }) => {
    const school = await SchoolFactory.create()
    const user = await UserFactory.create()
    await school.related('users').attach({ [user.id]: { role_id: Roles.PRINCIPAL } })

    const response = await client
      .get('/audit-logs')
      .loginAs(user)
      .withSession({ schoolId: school.id })
      .withInertia()

    response.assertStatus(403)
  })

  test('teacher cannot access audit logs', async ({ client }) => {
    const school = await SchoolFactory.create()
    const user = await UserFactory.create()
    await school.related('users').attach({ [user.id]: { role_id: Roles.TEACHER } })

    const response = await client
      .get('/audit-logs')
      .loginAs(user)
      .withSession({ schoolId: school.id })
      .withInertia()

    response.assertStatus(403)
  })

  test('accountant cannot access audit logs', async ({ client }) => {
    const school = await SchoolFactory.create()
    const user = await UserFactory.create()
    await school.related('users').attach({ [user.id]: { role_id: Roles.ACCOUNTANT } })

    const response = await client
      .get('/audit-logs')
      .loginAs(user)
      .withSession({ schoolId: school.id })
      .withInertia()

    response.assertStatus(403)
  })

  test('unauthenticated user is redirected', async ({ client }) => {
    const response = await client.get('/audit-logs').withInertia()

    response.assertRedirectsTo('/auth/login')
  })

  test('logs are scoped to the current school', async ({ client, assert }) => {
    const schoolA = await SchoolFactory.create()
    const schoolB = await SchoolFactory.create()
    const adminA = await UserFactory.create()
    await schoolA.related('users').attach({ [adminA.id]: { role_id: Roles.SCHOOL_ADMIN } })

    // Create an audit log for school A
    await AuditLog.create({
      schoolId: schoolA.id,
      action: 'create',
      entityType: 'Student',
      description: 'School A event',
    })

    // Create an audit log for school B
    await AuditLog.create({
      schoolId: schoolB.id,
      action: 'create',
      entityType: 'Student',
      description: 'School B event',
    })

    const response = await client
      .get('/audit-logs')
      .loginAs(adminA)
      .withSession({ schoolId: schoolA.id })
      .withInertia()

    response.assertStatus(200)
    const { props } = response.body()
    assert.equal(props.logs.data.length, 1)
    assert.equal(props.logs.data[0].description, 'School A event')
  })

  test('filter by action returns only matching logs', async ({ client, assert }) => {
    const school = await SchoolFactory.create()
    const user = await UserFactory.create()
    await school.related('users').attach({ [user.id]: { role_id: Roles.SCHOOL_ADMIN } })

    await AuditLog.createMany([
      { schoolId: school.id, action: 'create', entityType: 'Student', description: 'created' },
      { schoolId: school.id, action: 'delete', entityType: 'Student', description: 'deleted' },
      { schoolId: school.id, action: 'login', entityType: 'User', description: 'logged in' },
    ])

    const response = await client
      .get('/audit-logs?action=create')
      .loginAs(user)
      .withSession({ schoolId: school.id })
      .withInertia()

    response.assertStatus(200)
    const { props } = response.body()
    assert.equal(props.logs.data.length, 1)
    assert.equal(props.logs.data[0].action, 'create')
  })

  test('filter by date range returns only logs within range', async ({ client, assert }) => {
    const school = await SchoolFactory.create()
    const user = await UserFactory.create()
    await school.related('users').attach({ [user.id]: { role_id: Roles.SCHOOL_ADMIN } })

    await AuditLog.create({ schoolId: school.id, action: 'create', entityType: 'Student', description: 'log in range' })

    // Use a range of yesterday to tomorrow to avoid timezone edge cases
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
    const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10)

    const response = await client
      .get(`/audit-logs?from=${yesterday}&to=${tomorrow}`)
      .loginAs(user)
      .withSession({ schoolId: school.id })
      .withInertia()

    response.assertStatus(200)
    const { props } = response.body()
    assert.equal(props.logs.data.length, 1)
  })

  test('search by IP returns only matching logs', async ({ client, assert }) => {
    const school = await SchoolFactory.create()
    const user = await UserFactory.create()
    await school.related('users').attach({ [user.id]: { role_id: Roles.SCHOOL_ADMIN } })

    await AuditLog.createMany([
      { schoolId: school.id, action: 'login', entityType: 'User', ipAddress: '192.168.1.100', description: 'from specific IP' },
      { schoolId: school.id, action: 'login', entityType: 'User', ipAddress: '10.0.0.1', description: 'from other IP' },
    ])

    const response = await client
      .get('/audit-logs?search=192.168.1.100')
      .loginAs(user)
      .withSession({ schoolId: school.id })
      .withInertia()

    response.assertStatus(200)
    const { props } = response.body()
    assert.equal(props.logs.data.length, 1)
    assert.equal(props.logs.data[0].ipAddress, '192.168.1.100')
  })

  test('pagination works', async ({ client, assert }) => {
    const school = await SchoolFactory.create()
    const user = await UserFactory.create()
    await school.related('users').attach({ [user.id]: { role_id: Roles.SCHOOL_ADMIN } })

    // Create 55 logs (more than the 50-per-page limit)
    const logs = Array.from({ length: 55 }, (_, i) => ({
      schoolId: school.id,
      action: 'create',
      entityType: 'Student',
      description: `log ${i + 1}`,
    }))
    await AuditLog.createMany(logs)

    const page2 = await client
      .get('/audit-logs?page=2')
      .loginAs(user)
      .withSession({ schoolId: school.id })
      .withInertia()

    page2.assertStatus(200)
    const { props } = page2.body()
    assert.equal(props.logs.meta.currentPage, 2)
    assert.equal(props.logs.data.length, 5)
  })
})

import { test } from '@japa/runner'
import { UserFactory } from '../../factories/user_factory.js'
import { SchoolFactory } from '../../factories/school_factory.js'
import { LeaveTypeFactory } from '../../factories/leave_type_factory.js'
import LeaveType from '#models/leave_type'
import Roles from '#enums/roles'

test.group('attendance/leave-types', () => {
  // Confirms that an authenticated user can view the leave types list
  test('authenticated user can view leave types list', async ({ client }) => {
    const school = await SchoolFactory.create()
    const user = await UserFactory.create()
    await school.related('users').attach({
      [user.id]: { role_id: Roles.SCHOOL_ADMIN },
    })

    await LeaveTypeFactory.merge({ schoolId: school.id }).createMany(3)

    const response = await client
      .get('/attendance/leave-types')
      .loginAs(user)
      .withSession({ schoolId: school.id })
      .withInertia()

    response.assertStatus(200)
    response.assertInertiaComponent('school/attendance/leave-types/index')
  })

  // Confirms that an authenticated user can create a leave type
  test('authenticated user can create a leave type', async ({ client, assert }) => {
    const school = await SchoolFactory.create()
    const user = await UserFactory.create()
    await school.related('users').attach({
      [user.id]: { role_id: Roles.SCHOOL_ADMIN },
    })

    const leaveTypeData = {
      name: 'Sick Leave',
      code: 'SL',
      description: 'Leave for medical reasons',
      allowedDays: 15,
      isPaid: true,
      isActive: true,
      appliesTo: 'all',
    }

    const response = await client
      .post('/attendance/leave-types')
      .loginAs(user)
      .withCsrfToken()
      .withSession({ schoolId: school.id })
      .form(leaveTypeData)

    response.assertRedirectsTo('/attendance/leave-types')

    const leaveType = await LeaveType.query()
      .where('schoolId', school.id)
      .where('code', 'SL')
      .first()
    assert.exists(leaveType)
    assert.equal(leaveType?.name, 'Sick Leave')
    assert.equal(leaveType?.allowedDays, 15)
    assert.isTrue(leaveType?.isPaid)
  })

  // Validates that required fields must be provided
  test('validation fails without required fields', async ({ client }) => {
    const school = await SchoolFactory.create()
    const user = await UserFactory.create()
    await school.related('users').attach({
      [user.id]: { role_id: Roles.SCHOOL_ADMIN },
    })

    const response = await client
      .post('/attendance/leave-types')
      .loginAs(user)
      .withCsrfToken()
      .withSession({ schoolId: school.id })
      .withInertia()
      .form({})

    // Inertia returns 200 with validation errors
    response.assertStatus(200)
    response.assertInertiaPropsContains({ errors: {} })
  })

  // Validates that leave type code must be unique within school
  test('leave type code must be unique within school', async ({ client, assert }) => {
    const school = await SchoolFactory.create()
    const user = await UserFactory.create()
    await school.related('users').attach({
      [user.id]: { role_id: Roles.SCHOOL_ADMIN },
    })

    await LeaveTypeFactory.merge({ schoolId: school.id, code: 'SL' }).create()

    await client
      .post('/attendance/leave-types')
      .loginAs(user)
      .withCsrfToken()
      .withSession({ schoolId: school.id })
      .form({
        name: 'Another Sick Leave',
        code: 'SL',
        allowedDays: 10,
      })

    // Should not have created a new leave type
    const leaveTypesCount = await LeaveType.query()
      .where('schoolId', school.id)
      .where('code', 'SL')
      .count('* as total')
    assert.equal(Number(leaveTypesCount[0].$extras.total), 1)
  })

  // Confirms that same code can be used in different schools
  test('same code can be used in different schools', async ({ client, assert }) => {
    const school1 = await SchoolFactory.create()
    const school2 = await SchoolFactory.create()
    const user = await UserFactory.create()
    await school1.related('users').attach({
      [user.id]: { role_id: Roles.SCHOOL_ADMIN },
    })
    await school2.related('users').attach({
      [user.id]: { role_id: Roles.SCHOOL_ADMIN },
    })

    await LeaveTypeFactory.merge({ schoolId: school1.id, code: 'SL' }).create()

    const response = await client
      .post('/attendance/leave-types')
      .loginAs(user)
      .withCsrfToken()
      .withSession({ schoolId: school2.id })
      .form({
        name: 'Sick Leave',
        code: 'SL',
        allowedDays: 10,
      })

    response.assertRedirectsTo('/attendance/leave-types')

    // Query only within the two specific test schools
    const leaveTypesCount = await LeaveType.query()
      .where('code', 'SL')
      .whereIn('schoolId', [school1.id, school2.id])
      .count('* as total')
    assert.equal(Number(leaveTypesCount[0].$extras.total), 2)
  })

  // Confirms that an authenticated user can update a leave type
  test('authenticated user can update a leave type', async ({ client, assert }) => {
    const school = await SchoolFactory.create()
    const user = await UserFactory.create()
    await school.related('users').attach({
      [user.id]: { role_id: Roles.SCHOOL_ADMIN },
    })

    const leaveType = await LeaveTypeFactory.merge({ schoolId: school.id }).create()

    const response = await client
      .put(`/attendance/leave-types/${leaveType.id}`)
      .loginAs(user)
      .withCsrfToken()
      .withSession({ schoolId: school.id })
      .form({
        name: 'Updated Leave',
        code: leaveType.code,
        allowedDays: 20,
      })

    response.assertRedirectsTo('/attendance/leave-types')

    await leaveType.refresh()
    assert.equal(leaveType.name, 'Updated Leave')
    assert.equal(leaveType.allowedDays, 20)
  })

  // Confirms that an authenticated user can delete a leave type
  test('authenticated user can delete a leave type', async ({ client, assert }) => {
    const school = await SchoolFactory.create()
    const user = await UserFactory.create()
    await school.related('users').attach({
      [user.id]: { role_id: Roles.SCHOOL_ADMIN },
    })

    const leaveType = await LeaveTypeFactory.merge({ schoolId: school.id }).create()

    const response = await client
      .delete(`/attendance/leave-types/${leaveType.id}`)
      .loginAs(user)
      .withCsrfToken()
      .withSession({ schoolId: school.id })

    response.assertRedirectsTo('/attendance/leave-types')

    const deletedLeaveType = await LeaveType.find(leaveType.id)
    assert.isNull(deletedLeaveType)
  })

  // Ensures unauthenticated users are redirected to login
  test('unauthenticated users are redirected to login', async ({ client }) => {
    const response = await client.get('/attendance/leave-types')

    response.assertRedirectsTo('/auth/login')
  })

  // Ensures user cannot access leave types without school context
  test('user without school context is redirected', async ({ client }) => {
    const user = await UserFactory.create()

    const response = await client.get('/attendance/leave-types').loginAs(user)

    response.assertRedirectsTo('/auth/login')
  })
})

import { test } from '@japa/runner'
import { UserFactory } from '../../factories/user_factory.js'
import { SchoolFactory } from '../../factories/school_factory.js'
import { DepartmentFactory } from '../../factories/department_factory.js'
import { DesignationFactory } from '../../factories/designation_factory.js'
import { StaffFactory } from '../../factories/staff_factory.js'

import User from '#models/user'
import Roles from '#enums/roles'
import { randomUUID } from 'node:crypto'

test.group('staff/user-linking', () => {
  // Ensures a new user account can be created for a staff member
  test('can create a new user account for a staff member', async ({ client, assert }) => {
    const school = await SchoolFactory.create()
    const user = await UserFactory.create()
    await user.related('schools').attach([school.id])

    const department = await DepartmentFactory.merge({ schoolId: school.id }).create()
    const designation = await DesignationFactory.merge({
      schoolId: school.id,
      departmentId: department.id,
    }).create()
    const uniqueEmail = `staff-create-${randomUUID()}@school.com`
    const staff = await StaffFactory.merge({
      schoolId: school.id,
      departmentId: department.id,
      designationId: designation.id,
      email: uniqueEmail,
      userId: null,
    }).create()

    const response = await client
      .post(`/staff/members/${staff.id}/link-user`)
      .loginAs(user)
      .withCsrfToken()
      .withSession({ schoolId: school.id })
      .form({
        action: 'create',
        password: 'password123',
        roleId: Roles.TEACHER,
      })

    response.assertRedirectsTo(`/staff/members/${staff.id}`)

    await staff.refresh()
    assert.isNotNull(staff.userId)

    const linkedUser = await User.find(staff.userId!)
    assert.exists(linkedUser)
    assert.equal(linkedUser?.email, uniqueEmail)
    assert.equal(linkedUser?.firstName, staff.firstName)

    // Check user is attached to school with correct role - need to reload with pivot
    const userSchools = await linkedUser!
      .related('schools')
      .query()
      .pivotColumns(['role_id'])
      .where('schools.id', school.id)
    assert.lengthOf(userSchools, 1)
    assert.equal(userSchools[0].$extras.pivot_role_id, Roles.TEACHER)
  })

  // Ensures an existing user can be linked to a staff member
  test('can link an existing user to a staff member', async ({ client, assert }) => {
    const school = await SchoolFactory.create()
    const adminUser = await UserFactory.create()
    await adminUser.related('schools').attach([school.id])

    const existingUser = await UserFactory.merge({
      email: 'existing@school.com',
      firstName: 'Existing',
    }).create()

    const department = await DepartmentFactory.merge({ schoolId: school.id }).create()
    const designation = await DesignationFactory.merge({
      schoolId: school.id,
      departmentId: department.id,
    }).create()
    const staff = await StaffFactory.merge({
      schoolId: school.id,
      departmentId: department.id,
      designationId: designation.id,
      email: 'staff@school.com',
      userId: null,
    }).create()

    const response = await client
      .post(`/staff/members/${staff.id}/link-user`)
      .loginAs(adminUser)
      .withCsrfToken()
      .withSession({ schoolId: school.id })
      .form({
        action: 'link',
        userId: existingUser.id,
        roleId: Roles.ACCOUNTANT,
      })

    response.assertRedirectsTo(`/staff/members/${staff.id}`)

    await staff.refresh()
    assert.equal(staff.userId, existingUser.id)

    // Check user is attached to school with correct role - reload with pivot
    const userSchools = await existingUser
      .related('schools')
      .query()
      .pivotColumns(['role_id'])
      .where('schools.id', school.id)
    assert.lengthOf(userSchools, 1)
    assert.equal(userSchools[0].$extras.pivot_role_id, Roles.ACCOUNTANT)
  })

  // Ensures a user can be unlinked from a staff member
  test('can unlink a user from a staff member', async ({ client, assert }) => {
    const school = await SchoolFactory.create()
    const adminUser = await UserFactory.create()
    await adminUser.related('schools').attach([school.id])

    const linkedUser = await UserFactory.create()
    await linkedUser.related('schools').attach({
      [school.id]: { role_id: Roles.TEACHER },
    })

    const department = await DepartmentFactory.merge({ schoolId: school.id }).create()
    const designation = await DesignationFactory.merge({
      schoolId: school.id,
      departmentId: department.id,
    }).create()
    const staff = await StaffFactory.merge({
      schoolId: school.id,
      departmentId: department.id,
      designationId: designation.id,
      userId: linkedUser.id,
    }).create()

    const response = await client
      .post(`/staff/members/${staff.id}/unlink-user`)
      .loginAs(adminUser)
      .withCsrfToken()
      .withSession({ schoolId: school.id })

    response.assertRedirectsTo(`/staff/members/${staff.id}`)

    await staff.refresh()
    assert.isNull(staff.userId)

    // User should be detached from school
    const userSchools = await linkedUser.related('schools').query().where('schools.id', school.id)
    assert.lengthOf(userSchools, 0)
  })

  // Ensures staff must have email to create user account
  test('cannot create user account if staff has no email', async ({ client }) => {
    const school = await SchoolFactory.create()
    const user = await UserFactory.create()
    await user.related('schools').attach([school.id])

    const department = await DepartmentFactory.merge({ schoolId: school.id }).create()
    const designation = await DesignationFactory.merge({
      schoolId: school.id,
      departmentId: department.id,
    }).create()
    const staff = await StaffFactory.merge({
      schoolId: school.id,
      departmentId: department.id,
      designationId: designation.id,
      email: null,
      userId: null,
    }).create()

    const response = await client
      .post(`/staff/members/${staff.id}/link-user`)
      .loginAs(user)
      .withCsrfToken()
      .withSession({ schoolId: school.id })
      .form({
        action: 'create',
        password: 'password123',
        roleId: Roles.TEACHER,
      })

    response.assertStatus(400)
  })

  // Ensures cannot create user with already taken email
  test('cannot create user if email is already taken', async ({ client, assert }) => {
    const school = await SchoolFactory.create()
    const user = await UserFactory.create()
    await user.related('schools').attach([school.id])

    // Create a user with a unique email for this test
    const takenEmail = `taken-${randomUUID()}@school.com`
    await UserFactory.merge({ email: takenEmail }).create()

    const department = await DepartmentFactory.merge({ schoolId: school.id }).create()
    const designation = await DesignationFactory.merge({
      schoolId: school.id,
      departmentId: department.id,
    }).create()
    const staff = await StaffFactory.merge({
      schoolId: school.id,
      departmentId: department.id,
      designationId: designation.id,
      email: takenEmail,
      userId: null,
    }).create()

    const response = await client
      .post(`/staff/members/${staff.id}/link-user`)
      .loginAs(user)
      .withCsrfToken()
      .withSession({ schoolId: school.id })
      .redirects(0)
      .form({
        action: 'create',
        password: 'password123',
        roleId: Roles.TEACHER,
      })

    // Validation error - email taken redirects back with flash errors
    response.assertStatus(302)
    assert.exists(response.flashMessage('errors'))

    await staff.refresh()
    assert.isNull(staff.userId)
  })

  // Ensures staff from another school cannot be accessed
  test('cannot link user to staff from another school', async ({ client }) => {
    const school1 = await SchoolFactory.create()
    const school2 = await SchoolFactory.create()
    const user = await UserFactory.create()
    await user.related('schools').attach([school1.id])

    const department = await DepartmentFactory.merge({ schoolId: school2.id }).create()
    const designation = await DesignationFactory.merge({
      schoolId: school2.id,
      departmentId: department.id,
    }).create()
    const staff = await StaffFactory.merge({
      schoolId: school2.id,
      departmentId: department.id,
      designationId: designation.id,
    }).create()

    const response = await client
      .post(`/staff/members/${staff.id}/link-user`)
      .loginAs(user)
      .withCsrfToken()
      .withSession({ schoolId: school1.id })
      .form({
        action: 'create',
        password: 'password123',
        roleId: Roles.TEACHER,
      })

    response.assertStatus(404)
  })

  // Ensures unauthenticated users cannot link users
  test('unauthenticated users cannot link users', async ({ client }) => {
    const school = await SchoolFactory.create()
    const department = await DepartmentFactory.merge({ schoolId: school.id }).create()
    const designation = await DesignationFactory.merge({
      schoolId: school.id,
      departmentId: department.id,
    }).create()
    const staff = await StaffFactory.merge({
      schoolId: school.id,
      departmentId: department.id,
      designationId: designation.id,
    }).create()

    const response = await client
      .post(`/staff/members/${staff.id}/link-user`)
      .withCsrfToken()
      .form({
        action: 'create',
        password: 'password123',
        roleId: Roles.TEACHER,
      })

    response.assertRedirectsTo('/auth/login')
  })
})

import { test } from '@japa/runner'
import { UserFactory } from '../../factories/user_factory.js'
import { SchoolFactory } from '../../factories/school_factory.js'
import { DepartmentFactory } from '../../factories/department_factory.js'
import { DesignationFactory } from '../../factories/designation_factory.js'
import { StaffFactory } from '../../factories/staff_factory.js'
import Staff from '#models/staff_member'

test.group('staff/staff', () => {
  // Ensures authenticated user can view staff list
  test('authenticated user can view staff list', async ({ client }) => {
    const school = await SchoolFactory.create()
    const user = await UserFactory.create()
    await user.related('schools').attach([school.id])

    const department = await DepartmentFactory.merge({ schoolId: school.id }).create()
    const designation = await DesignationFactory.merge({
      schoolId: school.id,
      departmentId: department.id,
    }).create()
    await StaffFactory.merge({
      schoolId: school.id,
      departmentId: department.id,
      designationId: designation.id,
    }).create()

    const response = await client
      .get('/staff/members')
      .loginAs(user)
      .withCsrfToken()
      .withSession({ schoolId: school.id })
      .withInertia()

    response.assertStatus(200)
    response.assertInertiaComponent('school/staff/members/index')
  })

  // Ensures authenticated user can create a staff member
  test('authenticated user can create a staff member', async ({ client, assert }) => {
    const school = await SchoolFactory.create()
    const user = await UserFactory.create()
    await user.related('schools').attach([school.id])

    const department = await DepartmentFactory.merge({ schoolId: school.id }).create()
    const designation = await DesignationFactory.merge({
      schoolId: school.id,
      departmentId: department.id,
    }).create()

    const staffData = {
      departmentId: department.id,
      designationId: designation.id,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@school.com',
      phone: '+923001234567',
      employmentType: 'full_time',
      basicSalary: 50000,
      status: 'active',
    }

    const response = await client
      .post('/staff/members')
      .loginAs(user)
      .withCsrfToken()
      .withSession({ schoolId: school.id })
      .form(staffData)

    response.assertRedirectsTo('/staff/members')

    const staff = await Staff.findBy('email', staffData.email)
    assert.exists(staff)
    assert.equal(staff?.schoolId, school.id)
    assert.equal(staff?.firstName, 'John')
    assert.isNotNull(staff?.staffMemberId) // Auto-generated staff ID
  })

  // Ensures staff member can be updated
  test('authenticated user can update a staff member', async ({ client, assert }) => {
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
      firstName: 'John',
    }).create()

    const response = await client
      .put(`/staff/members/${staff.id}`)
      .loginAs(user)
      .withCsrfToken()
      .withSession({ schoolId: school.id })
      .form({ firstName: 'Jane', basicSalary: 60000 })

    response.assertRedirectsTo('/staff/members')

    await staff.refresh()
    assert.equal(staff.firstName, 'Jane')
    assert.equal(staff.basicSalary, 60000)
  })

  // Ensures staff member can be deleted
  test('authenticated user can delete a staff member', async ({ client, assert }) => {
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
    }).create()

    const response = await client
      .delete(`/staff/members/${staff.id}`)
      .loginAs(user)
      .withCsrfToken()
      .withSession({ schoolId: school.id })

    response.assertRedirectsTo('/staff/members')

    const deleted = await Staff.find(staff.id)
    assert.isNull(deleted)
  })

  // Ensures unauthenticated users are redirected
  test('unauthenticated users are redirected to login', async ({ client }) => {
    const response = await client.get('/staff/members').withCsrfToken()

    response.assertRedirectsTo('/auth/login')
  })

  // Ensures staff members are scoped to the current school
  test('staff members are scoped to the current school', async ({ client, assert }) => {
    const school1 = await SchoolFactory.create()
    const school2 = await SchoolFactory.create()
    const user = await UserFactory.create()
    await user.related('schools').attach([school1.id, school2.id])

    const department1 = await DepartmentFactory.merge({ schoolId: school1.id }).create()
    const designation1 = await DesignationFactory.merge({
      schoolId: school1.id,
      departmentId: department1.id,
    }).create()
    await StaffFactory.merge({
      schoolId: school1.id,
      departmentId: department1.id,
      designationId: designation1.id,
      firstName: 'Staff A',
    }).create()

    const department2 = await DepartmentFactory.merge({ schoolId: school2.id }).create()
    const designation2 = await DesignationFactory.merge({
      schoolId: school2.id,
      departmentId: department2.id,
    }).create()
    await StaffFactory.merge({
      schoolId: school2.id,
      departmentId: department2.id,
      designationId: designation2.id,
      firstName: 'Staff B',
    }).create()

    const response = await client
      .get('/staff/members')
      .loginAs(user)
      .withCsrfToken()
      .withSession({ schoolId: school1.id })
      .withInertia()

    response.assertStatus(200)
    const staffMembers = response.inertiaProps.staff as { firstName: string }[]
    assert.lengthOf(staffMembers, 1)
    assert.equal(staffMembers[0].firstName, 'Staff A')
  })
})

import { test } from '@japa/runner'
import { UserFactory } from '../../factories/user_factory.js'
import { SchoolFactory } from '../../factories/school_factory.js'
import { DepartmentFactory } from '../../factories/department_factory.js'
import { DesignationFactory } from '../../factories/designation_factory.js'
import Designation from '#models/designation'

test.group('staff/designations', () => {
  // Ensures authenticated user can view designations list
  test('authenticated user can view designations list', async ({ client }) => {
    const school = await SchoolFactory.create()
    const user = await UserFactory.create()
    await user.related('schools').attach([school.id])

    const department = await DepartmentFactory.merge({ schoolId: school.id }).create()
    await DesignationFactory.merge({
      schoolId: school.id,
      departmentId: department.id,
      name: 'Senior Teacher',
    }).create()

    const response = await client
      .get('/staff/designations')
      .loginAs(user)
      .withCsrfToken()
      .withSession({ schoolId: school.id })
      .withInertia()

    response.assertStatus(200)
    response.assertInertiaComponent('school/staff/designations/index')
  })

  // Ensures authenticated user can create a designation
  test('authenticated user can create a designation', async ({ client, assert }) => {
    const school = await SchoolFactory.create()
    const user = await UserFactory.create()
    await user.related('schools').attach([school.id])

    const department = await DepartmentFactory.merge({ schoolId: school.id }).create()

    const designationData = {
      departmentId: department.id,
      name: 'Head of Department',
      description: 'Leader of the department',
      isActive: true,
    }

    const response = await client
      .post('/staff/designations')
      .loginAs(user)
      .withCsrfToken()
      .withSession({ schoolId: school.id })
      .form(designationData)

    response.assertRedirectsTo('/staff/designations')

    const designation = await Designation.findBy('name', designationData.name)
    assert.exists(designation)
    assert.equal(designation?.schoolId, school.id)
    assert.equal(designation?.departmentId, department.id)
  })

  // Ensures designation can be updated
  test('authenticated user can update a designation', async ({ client, assert }) => {
    const school = await SchoolFactory.create()
    const user = await UserFactory.create()
    await user.related('schools').attach([school.id])

    const department = await DepartmentFactory.merge({ schoolId: school.id }).create()
    const designation = await DesignationFactory.merge({
      schoolId: school.id,
      departmentId: department.id,
      name: 'Junior Teacher',
    }).create()

    const response = await client
      .put(`/staff/designations/${designation.id}`)
      .loginAs(user)
      .withCsrfToken()
      .withSession({ schoolId: school.id })
      .form({ name: 'Senior Teacher' })

    response.assertRedirectsTo('/staff/designations')

    await designation.refresh()
    assert.equal(designation.name, 'Senior Teacher')
  })

  // Ensures designation can be deleted
  test('authenticated user can delete a designation', async ({ client, assert }) => {
    const school = await SchoolFactory.create()
    const user = await UserFactory.create()
    await user.related('schools').attach([school.id])

    const department = await DepartmentFactory.merge({ schoolId: school.id }).create()
    const designation = await DesignationFactory.merge({
      schoolId: school.id,
      departmentId: department.id,
    }).create()

    const response = await client
      .delete(`/staff/designations/${designation.id}`)
      .loginAs(user)
      .withCsrfToken()
      .withSession({ schoolId: school.id })

    response.assertRedirectsTo('/staff/designations')

    const deleted = await Designation.find(designation.id)
    assert.isNull(deleted)
  })

  // Ensures unauthenticated users are redirected
  test('unauthenticated users are redirected to login', async ({ client }) => {
    const response = await client.get('/staff/designations').withCsrfToken()

    response.assertRedirectsTo('/auth/login')
  })
})

import { test } from '@japa/runner'
import { UserFactory } from '../../factories/user_factory.js'
import { SchoolFactory } from '../../factories/school_factory.js'
import { DepartmentFactory } from '../../factories/department_factory.js'
import Department from '#models/department'

test.group('staff/departments', () => {
  // Ensures authenticated user can view departments list
  test('authenticated user can view departments list', async ({ client }) => {
    const school = await SchoolFactory.create()
    const user = await UserFactory.create()
    await user.related('schools').attach([school.id])

    await DepartmentFactory.merge({ schoolId: school.id, name: 'Mathematics' }).create()
    await DepartmentFactory.merge({ schoolId: school.id, name: 'Science' }).create()

    const response = await client
      .get('/staff/departments')
      .loginAs(user)
      .withCsrfToken()
      .withSession({ schoolId: school.id })
      .withInertia()

    response.assertStatus(200)
    response.assertInertiaComponent('school/staff/departments/index')
  })

  // Ensures authenticated user can create a department
  test('authenticated user can create a department', async ({ client, assert }) => {
    const school = await SchoolFactory.create()
    const user = await UserFactory.create()
    await user.related('schools').attach([school.id])

    const departmentData = {
      name: 'Computer Science',
      description: 'Department of Computer Science and IT',
      isActive: true,
    }

    const response = await client
      .post('/staff/departments')
      .loginAs(user)
      .withCsrfToken()
      .withSession({ schoolId: school.id })
      .form(departmentData)

    response.assertRedirectsTo('/staff/departments')

    const department = await Department.findBy('name', departmentData.name)
    assert.exists(department)
    assert.equal(department?.schoolId, school.id)
    assert.equal(department?.description, departmentData.description)
  })

  // Ensures department can be updated
  test('authenticated user can update a department', async ({ client, assert }) => {
    const school = await SchoolFactory.create()
    const user = await UserFactory.create()
    await user.related('schools').attach([school.id])

    const department = await DepartmentFactory.merge({
      schoolId: school.id,
      name: 'Science',
    }).create()

    const response = await client
      .put(`/staff/departments/${department.id}`)
      .loginAs(user)
      .withCsrfToken()
      .withSession({ schoolId: school.id })
      .form({ name: 'Natural Sciences', description: 'Updated description' })

    response.assertRedirectsTo('/staff/departments')

    await department.refresh()
    assert.equal(department.name, 'Natural Sciences')
    assert.equal(department.description, 'Updated description')
  })

  // Ensures department can be deleted
  test('authenticated user can delete a department', async ({ client, assert }) => {
    const school = await SchoolFactory.create()
    const user = await UserFactory.create()
    await user.related('schools').attach([school.id])

    const department = await DepartmentFactory.merge({
      schoolId: school.id,
    }).create()

    const response = await client
      .delete(`/staff/departments/${department.id}`)
      .loginAs(user)
      .withCsrfToken()
      .withSession({ schoolId: school.id })

    response.assertRedirectsTo('/staff/departments')

    const deleted = await Department.find(department.id)
    assert.isNull(deleted)
  })

  // Ensures department name is required for creation
  test('department name is required', async ({ client, assert }) => {
    const school = await SchoolFactory.create()
    const user = await UserFactory.create()
    await user.related('schools').attach([school.id])

    const countBefore = await Department.query().where('schoolId', school.id).count('* as total')

    await client
      .post('/staff/departments')
      .loginAs(user)
      .withCsrfToken()
      .withSession({ schoolId: school.id })
      .form({ description: 'Some description' })

    const countAfter = await Department.query().where('schoolId', school.id).count('* as total')
    assert.equal(
      Number(countAfter[0].$extras.total),
      Number(countBefore[0].$extras.total),
      'Department without name should not be created'
    )
  })

  // Ensures unauthenticated users are redirected
  test('unauthenticated users are redirected to login', async ({ client }) => {
    const response = await client.get('/staff/departments').withCsrfToken()

    response.assertRedirectsTo('/auth/login')
  })

  // Ensures departments are scoped to the current school
  test('departments are scoped to the current school', async ({ client, assert }) => {
    const school1 = await SchoolFactory.create()
    const school2 = await SchoolFactory.create()
    const user = await UserFactory.create()
    await user.related('schools').attach([school1.id, school2.id])

    await DepartmentFactory.merge({ schoolId: school1.id, name: 'Dept A' }).create()
    await DepartmentFactory.merge({ schoolId: school2.id, name: 'Dept B' }).create()

    const response = await client
      .get('/staff/departments')
      .loginAs(user)
      .withCsrfToken()
      .withSession({ schoolId: school1.id })
      .withInertia()

    response.assertStatus(200)
    const departments = response.inertiaProps.departments as { name: string }[]
    assert.lengthOf(departments, 1)
    assert.equal(departments[0].name, 'Dept A')
  })
})

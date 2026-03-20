import { test } from '@japa/runner'
import { UserFactory } from '../../factories/user_factory.js'
import { SchoolFactory } from '../../factories/school_factory.js'
import { DepartmentFactory } from '../../factories/department_factory.js'
import { DesignationFactory } from '../../factories/designation_factory.js'
import { StaffFactory } from '../../factories/staff_factory.js'
import { StaffQualificationFactory } from '../../factories/staff_qualification_factory.js'
import StaffQualification from '#models/staff_qualification'

test.group('staff/qualifications', () => {
  // Ensures authenticated user can view qualifications for a staff member
  test('authenticated user can view qualifications for a staff member', async ({ client }) => {
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

    await StaffQualificationFactory.merge({ staffMemberId: staff.id }).create()

    const response = await client
      .get(`/staff/members/${staff.id}/qualifications`)
      .loginAs(user)
      .withCsrfToken()
      .withSession({ schoolId: school.id })
      .withInertia()

    response.assertStatus(200)
    response.assertInertiaComponent('staff/qualifications/index')
  })

  // Ensures authenticated user can create a qualification
  test('authenticated user can create a qualification', async ({ client, assert }) => {
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

    const qualificationData = {
      degree: 'M.Sc',
      fieldOfStudy: 'Mathematics',
      institution: 'Punjab University',
      year: 2020,
      grade: 'A',
    }

    const response = await client
      .post(`/staff/members/${staff.id}/qualifications`)
      .loginAs(user)
      .withCsrfToken()
      .withSession({ schoolId: school.id })
      .form(qualificationData)

    response.assertRedirectsTo(`/staff/members/${staff.id}/qualifications`)

    const qualification = await StaffQualification.findBy('staffMemberId', staff.id)
    assert.exists(qualification)
    assert.equal(qualification?.degree, 'M.Sc')
    assert.equal(qualification?.fieldOfStudy, 'Mathematics')
    assert.equal(qualification?.institution, 'Punjab University')
    assert.equal(qualification?.year, 2020)
  })

  // Ensures qualification can be updated
  test('authenticated user can update a qualification', async ({ client, assert }) => {
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

    const qualification = await StaffQualificationFactory.merge({
      staffMemberId: staff.id,
      degree: 'B.Sc',
    }).create()

    const response = await client
      .put(`/staff/members/${staff.id}/qualifications/${qualification.id}`)
      .loginAs(user)
      .withCsrfToken()
      .withSession({ schoolId: school.id })
      .form({ degree: 'M.Sc', year: 2022 })

    response.assertRedirectsTo(`/staff/members/${staff.id}/qualifications`)

    await qualification.refresh()
    assert.equal(qualification.degree, 'M.Sc')
    assert.equal(qualification.year, 2022)
  })

  // Ensures qualification can be deleted
  test('authenticated user can delete a qualification', async ({ client, assert }) => {
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

    const qualification = await StaffQualificationFactory.merge({
      staffMemberId: staff.id,
    }).create()

    const response = await client
      .delete(`/staff/members/${staff.id}/qualifications/${qualification.id}`)
      .loginAs(user)
      .withCsrfToken()
      .withSession({ schoolId: school.id })

    response.assertRedirectsTo(`/staff/members/${staff.id}/qualifications`)

    const deleted = await StaffQualification.find(qualification.id)
    assert.isNull(deleted)
  })

  // Ensures unauthenticated users are redirected
  test('unauthenticated users are redirected to login', async ({ client }) => {
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

    const response = await client.get(`/staff/members/${staff.id}/qualifications`).withCsrfToken()

    response.assertRedirectsTo('/auth/login')
  })

  // Ensures validation fails without required fields
  test('validation fails without required fields', async ({ client, assert }) => {
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
      .post(`/staff/members/${staff.id}/qualifications`)
      .loginAs(user)
      .withCsrfToken()
      .withSession({ schoolId: school.id })
      .redirects(0)
      .form({})

    // Validation error redirects back with flash errors
    response.assertStatus(302)
    assert.exists(response.flashMessage('errors'))
  })

  // Ensures user cannot access qualifications of staff from another school
  test('user cannot access qualifications of staff from another school', async ({ client }) => {
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
      .get(`/staff/members/${staff.id}/qualifications`)
      .loginAs(user)
      .withCsrfToken()
      .withSession({ schoolId: school1.id })

    response.assertStatus(404)
  })
})

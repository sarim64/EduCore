import { test } from '@japa/runner'
import { UserFactory } from '../../factories/user_factory.js'
import { SchoolFactory } from '../../factories/school_factory.js'
import { DepartmentFactory } from '../../factories/department_factory.js'
import { DesignationFactory } from '../../factories/designation_factory.js'
import { StaffFactory } from '../../factories/staff_factory.js'
import { StaffDocumentFactory } from '../../factories/staff_document_factory.js'
import StaffDocument from '#models/staff_document'

test.group('staff/documents', () => {
  // Ensures authenticated user can view documents for a staff member
  test('authenticated user can view documents for a staff member', async ({ client }) => {
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

    await StaffDocumentFactory.merge({ staffMemberId: staff.id }).create()

    const response = await client
      .get(`/staff/members/${staff.id}/documents`)
      .loginAs(user)
      .withCsrfToken()
      .withSession({ schoolId: school.id })
      .withInertia()

    response.assertStatus(200)
    response.assertInertiaComponent('school/staff/documents/index')
  })

  // Ensures authenticated user can create a document
  test('authenticated user can create a document', async ({ client, assert }) => {
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

    const documentData = {
      name: 'CNIC Copy',
      type: 'identity',
      fileUrl: '/uploads/staff/documents/test-file.pdf',
      fileType: 'application/pdf',
      fileSize: 102400,
    }

    const response = await client
      .post(`/staff/members/${staff.id}/documents`)
      .loginAs(user)
      .withCsrfToken()
      .withSession({ schoolId: school.id })
      .form(documentData)

    response.assertRedirectsTo(`/staff/members/${staff.id}/documents`)

    const document = await StaffDocument.findBy('staffMemberId', staff.id)
    assert.exists(document)
    assert.equal(document?.name, 'CNIC Copy')
    assert.equal(document?.type, 'identity')
    assert.equal(document?.fileUrl, '/uploads/staff/documents/test-file.pdf')
  })

  // Ensures document can be updated
  test('authenticated user can update a document', async ({ client, assert }) => {
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

    const document = await StaffDocumentFactory.merge({
      staffMemberId: staff.id,
      name: 'Old Name',
    }).create()

    const response = await client
      .put(`/staff/members/${staff.id}/documents/${document.id}`)
      .loginAs(user)
      .withCsrfToken()
      .withSession({ schoolId: school.id })
      .form({ name: 'Updated Name', notes: 'Updated notes' })

    response.assertRedirectsTo(`/staff/members/${staff.id}/documents`)

    await document.refresh()
    assert.equal(document.name, 'Updated Name')
    assert.equal(document.notes, 'Updated notes')
  })

  // Ensures document can be deleted
  test('authenticated user can delete a document', async ({ client, assert }) => {
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

    const document = await StaffDocumentFactory.merge({
      staffMemberId: staff.id,
    }).create()

    const response = await client
      .delete(`/staff/members/${staff.id}/documents/${document.id}`)
      .loginAs(user)
      .withCsrfToken()
      .withSession({ schoolId: school.id })

    response.assertRedirectsTo(`/staff/members/${staff.id}/documents`)

    const deleted = await StaffDocument.find(document.id)
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

    const response = await client.get(`/staff/members/${staff.id}/documents`).withCsrfToken()

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
      .post(`/staff/members/${staff.id}/documents`)
      .loginAs(user)
      .withCsrfToken()
      .withSession({ schoolId: school.id })
      .redirects(0)
      .form({})

    // Validation error redirects back with flash errors
    response.assertStatus(302)
    assert.exists(response.flashMessage('errors'))
  })

  // Ensures user cannot access documents of staff from another school
  test('user cannot access documents of staff from another school', async ({ client }) => {
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
      .get(`/staff/members/${staff.id}/documents`)
      .loginAs(user)
      .withCsrfToken()
      .withSession({ schoolId: school1.id })

    response.assertStatus(404)
  })
})

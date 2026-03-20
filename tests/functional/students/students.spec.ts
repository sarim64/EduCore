import { test } from '@japa/runner'
import { UserFactory } from '../../factories/user_factory.js'
import { SchoolFactory } from '../../factories/school_factory.js'
import { StudentFactory } from '../../factories/student_factory.js'
import Student from '#models/student'

test.group('students', () => {
  // Ensures authenticated user can create a student
  test('authenticated user can create a student', async ({ client, assert }) => {
    const school = await SchoolFactory.create()
    const user = await UserFactory.create()
    await user.related('schools').attach([school.id])

    const studentData = {
      firstName: 'John',
      lastName: 'Doe',
      gender: 'male',
      email: 'john.doe@example.com',
      after: 'index',
    }

    const response = await client
      .post('/students')
      .loginAs(user)
      .withCsrfToken()
      .withSession({ schoolId: school.id })
      .form(studentData)

    response.assertRedirectsTo('/students')

    const student = await Student.query()
      .where('firstName', 'John')
      .where('schoolId', school.id)
      .first()

    assert.exists(student)
    assert.equal(student?.lastName, 'Doe')
    assert.isTrue(student?.studentId.startsWith('STU-'))
  })

  // Ensures student can be updated
  test('authenticated user can update a student', async ({ client, assert }) => {
    const school = await SchoolFactory.create()
    const user = await UserFactory.create()
    await user.related('schools').attach([school.id])

    const student = await StudentFactory.merge({
      schoolId: school.id,
      firstName: 'John',
    }).create()

    const response = await client
      .put(`/students/${student.id}`)
      .loginAs(user)
      .withCsrfToken()
      .withSession({ schoolId: school.id })
      .form({ firstName: 'Jane', lastName: 'Smith' })

    response.assertRedirectsTo('/students')

    await student.refresh()
    assert.equal(student.firstName, 'Jane')
    assert.equal(student.lastName, 'Smith')
  })

  // Ensures student can be deleted
  test('authenticated user can delete a student', async ({ client, assert }) => {
    const school = await SchoolFactory.create()
    const user = await UserFactory.create()
    await user.related('schools').attach([school.id])

    const student = await StudentFactory.merge({
      schoolId: school.id,
    }).create()

    const response = await client
      .delete(`/students/${student.id}`)
      .loginAs(user)
      .withCsrfToken()
      .withSession({ schoolId: school.id })

    response.assertRedirectsTo('/students')

    const deleted = await Student.find(student.id)
    assert.isNull(deleted)
  })

  // Ensures auto-generated student ID is unique per school
  test('student ID is auto-generated with correct format', async ({ client, assert }) => {
    const school = await SchoolFactory.create()
    const user = await UserFactory.create()
    await user.related('schools').attach([school.id])

    // Create first student
    await client
      .post('/students')
      .loginAs(user)
      .withCsrfToken()
      .withSession({ schoolId: school.id })
      .form({ firstName: 'First', lastName: 'Student' })

    // Create second student
    await client
      .post('/students')
      .loginAs(user)
      .withCsrfToken()
      .withSession({ schoolId: school.id })
      .form({ firstName: 'Second', lastName: 'Student' })

    const students = await Student.query().where('schoolId', school.id).orderBy('createdAt', 'asc')

    assert.equal(students.length, 2)

    // Check format: STU-YYYY-XXXX
    const year = new Date().getFullYear()
    assert.isTrue(students[0].studentId.startsWith(`STU-${year}-`))
    assert.isTrue(students[1].studentId.startsWith(`STU-${year}-`))

    // IDs should be different
    assert.notEqual(students[0].studentId, students[1].studentId)
  })

  // Ensures unauthenticated users cannot access students
  test('unauthenticated users cannot create students', async ({ client }) => {
    const response = await client.post('/students').withCsrfToken().form({ firstName: 'Test' })

    response.assertRedirectsTo('/auth/login')
  })
})

import { test } from '@japa/runner'
import { UserFactory } from '../../factories/user_factory.js'
import { SchoolFactory } from '../../factories/school_factory.js'
import { StudentFactory } from '../../factories/student_factory.js'
import { GuardianFactory } from '../../factories/guardian_factory.js'
import Guardian from '#models/guardian'
import db from '@adonisjs/lucid/services/db'

test.group('guardians', () => {
  // Ensures authenticated user can create a guardian
  test('authenticated user can create a guardian', async ({ client, assert }) => {
    const school = await SchoolFactory.create()
    const user = await UserFactory.create()
    await user.related('schools').attach([school.id])

    const guardianData = {
      firstName: 'Robert',
      lastName: 'Doe',
      relation: 'father',
      phone: '+1234567890',
      email: 'robert.doe@example.com',
    }

    const response = await client
      .post('/guardians')
      .loginAs(user)
      .withCsrfToken()
      .withSession({ schoolId: school.id })
      .form(guardianData)

    response.assertRedirectsTo('/guardians')

    const guardian = await Guardian.findBy('email', guardianData.email)
    assert.exists(guardian)
    assert.equal(guardian?.firstName, 'Robert')
    assert.equal(guardian?.relation, 'father')
  })

  // Ensures guardian can be updated
  test('authenticated user can update a guardian', async ({ client, assert }) => {
    const school = await SchoolFactory.create()
    const user = await UserFactory.create()
    await user.related('schools').attach([school.id])

    const guardian = await GuardianFactory.merge({
      schoolId: school.id,
      firstName: 'Robert',
    }).create()

    const response = await client
      .put(`/guardians/${guardian.id}`)
      .loginAs(user)
      .withCsrfToken()
      .withSession({ schoolId: school.id })
      .form({ firstName: 'Bob', relation: 'uncle' })

    response.assertRedirectsTo('/guardians')

    await guardian.refresh()
    assert.equal(guardian.firstName, 'Bob')
    assert.equal(guardian.relation, 'uncle')
  })

  // Ensures guardian can be attached to student
  test('authenticated user can attach guardian to student', async ({ client, assert }) => {
    const school = await SchoolFactory.create()
    const user = await UserFactory.create()
    await user.related('schools').attach([school.id])

    const student = await StudentFactory.merge({
      schoolId: school.id,
    }).create()

    const guardian = await GuardianFactory.merge({
      schoolId: school.id,
    }).create()

    const response = await client
      .post(`/students/${student.id}/guardians`)
      .loginAs(user)
      .withCsrfToken()
      .withSession({ schoolId: school.id })
      .header('Referer', `/students/${student.id}`)
      .form({
        guardianId: guardian.id,
        isPrimary: true,
        isEmergencyContact: true,
      })

    response.assertRedirectsTo(`/students/${student.id}`)

    const pivot = await db
      .from('student_guardians')
      .where('student_id', student.id)
      .where('guardian_id', guardian.id)
      .first()

    assert.exists(pivot)
    assert.equal(pivot.is_primary, true)
    assert.equal(pivot.is_emergency_contact, true)
  })

  // Ensures guardian can be detached from student
  test('authenticated user can detach guardian from student', async ({ client, assert }) => {
    const school = await SchoolFactory.create()
    const user = await UserFactory.create()
    await user.related('schools').attach([school.id])

    const student = await StudentFactory.merge({
      schoolId: school.id,
    }).create()

    const guardian = await GuardianFactory.merge({
      schoolId: school.id,
    }).create()

    // First attach
    await student.related('guardians').attach({
      [guardian.id]: {
        is_primary: true,
        is_emergency_contact: false,
        can_pickup: true,
      },
    })

    const response = await client
      .delete(`/students/${student.id}/guardians/${guardian.id}`)
      .loginAs(user)
      .withCsrfToken()
      .withSession({ schoolId: school.id })
      .header('Referer', `/students/${student.id}`)

    response.assertRedirectsTo(`/students/${student.id}`)

    const pivot = await db
      .from('student_guardians')
      .where('student_id', student.id)
      .where('guardian_id', guardian.id)
      .first()

    assert.isNull(pivot)
  })
})

import { test } from '@japa/runner'
import { UserFactory } from '../../factories/user_factory.js'
import { SchoolFactory } from '../../factories/school_factory.js'
import { SubjectFactory } from '../../factories/subject_factory.js'
import { SchoolClassFactory } from '../../factories/school_class_factory.js'
import Subject from '#models/subject'
import db from '@adonisjs/lucid/services/db'

test.group('academics/subjects', () => {
  // Ensures authenticated user can create a subject
  test('authenticated user can create a subject', async ({ client, assert }) => {
    const school = await SchoolFactory.create()
    const user = await UserFactory.create()
    await user.related('schools').attach([school.id])

    const subjectData = {
      name: 'Mathematics',
      code: 'MATH',
      isElective: false,
    }

    const response = await client
      .post('/academics/subjects')
      .loginAs(user)
      .withCsrfToken()
      .withSession({ schoolId: school.id })
      .form(subjectData)

    response.assertRedirectsTo('/academics/subjects')

    const subject = await Subject.query()
      .where('name', subjectData.name)
      .where('schoolId', school.id)
      .first()
    assert.exists(subject)
    assert.equal(subject?.code, 'MATH')
  })

  // Ensures subject can be updated
  test('authenticated user can update a subject', async ({ client, assert }) => {
    const school = await SchoolFactory.create()
    const user = await UserFactory.create()
    await user.related('schools').attach([school.id])

    const subject = await SubjectFactory.merge({
      schoolId: school.id,
      name: 'Mathematics',
      code: 'MATH',
    }).create()

    const response = await client
      .put(`/academics/subjects/${subject.id}`)
      .loginAs(user)
      .withCsrfToken()
      .withSession({ schoolId: school.id })
      .form({ name: 'Advanced Mathematics', code: 'AMATH' })

    response.assertRedirectsTo('/academics/subjects')

    await subject.refresh()
    assert.equal(subject.name, 'Advanced Mathematics')
    assert.equal(subject.code, 'AMATH')
  })

  // Ensures subject can be deleted
  test('authenticated user can delete a subject', async ({ client, assert }) => {
    const school = await SchoolFactory.create()
    const user = await UserFactory.create()
    await user.related('schools').attach([school.id])

    const subject = await SubjectFactory.merge({
      schoolId: school.id,
    }).create()

    const response = await client
      .delete(`/academics/subjects/${subject.id}`)
      .loginAs(user)
      .withCsrfToken()
      .withSession({ schoolId: school.id })

    response.assertRedirectsTo('/academics/subjects')

    const deleted = await Subject.find(subject.id)
    assert.isNull(deleted)
  })

  // Ensures subject can be assigned to a class
  test('authenticated user can assign a subject to a class', async ({ client, assert }) => {
    const school = await SchoolFactory.create()
    const user = await UserFactory.create()
    await user.related('schools').attach([school.id])

    const schoolClass = await SchoolClassFactory.merge({
      schoolId: school.id,
    }).create()

    const subject = await SubjectFactory.merge({
      schoolId: school.id,
      name: 'Mathematics',
      code: 'MATH',
    }).create()

    const response = await client
      .post('/academics/subjects/assign')
      .loginAs(user)
      .withCsrfToken()
      .withSession({ schoolId: school.id })
      .header('Referer', '/academics/subjects')
      .form({
        classId: schoolClass.id,
        subjectId: subject.id,
        periodsPerWeek: 5,
        isMandatory: true,
      })

    response.assertRedirectsTo('/academics/subjects')

    // Check the pivot table
    const pivot = await db
      .from('class_subjects')
      .where('class_id', schoolClass.id)
      .andWhere('subject_id', subject.id)
      .first()

    assert.exists(pivot)
    assert.equal(pivot.periods_per_week, 5)
    assert.equal(pivot.is_mandatory, true)
  })

  // Ensures subject can be removed from a class
  test('authenticated user can remove a subject from a class', async ({ client, assert }) => {
    const school = await SchoolFactory.create()
    const user = await UserFactory.create()
    await user.related('schools').attach([school.id])

    const schoolClass = await SchoolClassFactory.merge({
      schoolId: school.id,
    }).create()

    const subject = await SubjectFactory.merge({
      schoolId: school.id,
    }).create()

    // First assign the subject
    await subject.related('classes').attach({
      [schoolClass.id]: {
        school_id: school.id,
        periods_per_week: 3,
        is_mandatory: true,
      },
    })

    const response = await client
      .delete(`/academics/subjects/${subject.id}/class/${schoolClass.id}`)
      .loginAs(user)
      .withCsrfToken()
      .withSession({ schoolId: school.id })
      .header('Referer', '/academics/subjects')

    response.assertRedirectsTo('/academics/subjects')

    // Check the pivot table
    const pivot = await db
      .from('class_subjects')
      .where('class_id', schoolClass.id)
      .andWhere('subject_id', subject.id)
      .first()

    assert.isNull(pivot)
  })
})

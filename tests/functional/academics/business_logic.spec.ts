import { test } from '@japa/runner'
import { UserFactory } from '#tests/factories/user_factory'
import { SchoolFactory } from '#tests/factories/school_factory'
import { SchoolClassFactory } from '#tests/factories/school_class_factory'
import { SectionFactory } from '#tests/factories/section_factory'
import { SubjectFactory } from '#tests/factories/subject_factory'
import SchoolClass from '#models/school_class'
import Subject from '#models/subject'
import db from '@adonisjs/lucid/services/db'

test.group('Academics Business Logic', (group) => {
  group.tap((t) => t.tags(['@business-logic']))

  test('cannot delete class with existing sections', async ({ client, assert }) => {
    const school = await SchoolFactory.create()
    const user = await UserFactory.create()
    await user.related('schools').attach([school.id])

    const schoolClass = await SchoolClassFactory.merge({ schoolId: school.id }).create()
    await SectionFactory.merge({
      schoolId: school.id,
      classId: schoolClass.id,
    }).create()

    await client
      .delete(`/academics/classes/${schoolClass.id}`)
      .loginAs(user)
      .withCsrfToken()
      .withSession({ schoolId: school.id })

    // Verify class still exists (deletion should have been prevented)
    const stillExists = await SchoolClass.find(schoolClass.id)
    assert.exists(stillExists)
  })

  test('can delete class without sections', async ({ client, assert }) => {
    const school = await SchoolFactory.create()
    const user = await UserFactory.create()
    await user.related('schools').attach([school.id])

    const schoolClass = await SchoolClassFactory.merge({ schoolId: school.id }).create()

    const response = await client
      .delete(`/academics/classes/${schoolClass.id}`)
      .loginAs(user)
      .withCsrfToken()
      .withSession({ schoolId: school.id })

    response.assertRedirectsTo('/academics/classes')

    // Verify class was deleted
    const stillExists = await SchoolClass.find(schoolClass.id)
    assert.isNull(stillExists)
  })

  test('cannot delete subject assigned to classes', async ({ client, assert }) => {
    const school = await SchoolFactory.create()
    const user = await UserFactory.create()
    await user.related('schools').attach([school.id])

    const subject = await SubjectFactory.merge({ schoolId: school.id }).create()
    const schoolClass = await SchoolClassFactory.merge({ schoolId: school.id }).create()

    // Assign subject to class
    await subject.related('classes').attach({
      [schoolClass.id]: {
        school_id: school.id,
        periods_per_week: 5,
        is_mandatory: true,
      },
    })

    await client
      .delete(`/academics/subjects/${subject.id}`)
      .loginAs(user)
      .withCsrfToken()
      .withSession({ schoolId: school.id })

    // Verify subject still exists (deletion should have been prevented)
    const stillExists = await Subject.find(subject.id)
    assert.exists(stillExists)
  })

  test('can delete subject not assigned to any class', async ({ client, assert }) => {
    const school = await SchoolFactory.create()
    const user = await UserFactory.create()
    await user.related('schools').attach([school.id])

    const subject = await SubjectFactory.merge({ schoolId: school.id }).create()

    const response = await client
      .delete(`/academics/subjects/${subject.id}`)
      .loginAs(user)
      .withCsrfToken()
      .withSession({ schoolId: school.id })

    response.assertRedirectsTo('/academics/subjects')

    // Verify subject was deleted
    const stillExists = await Subject.find(subject.id)
    assert.isNull(stillExists)
  })

  test('duplicate class code rejected within same school', async ({ client, assert }) => {
    const school = await SchoolFactory.create()
    const user = await UserFactory.create()
    await user.related('schools').attach([school.id])

    await SchoolClassFactory.merge({
      schoolId: school.id,
      code: 'G1',
    }).create()

    await client
      .post('/academics/classes')
      .loginAs(user)
      .withCsrfToken()
      .withSession({ schoolId: school.id })
      .form({
        name: 'Grade 1A',
        code: 'G1', // Duplicate code
      })

    // Verify duplicate was not created
    const classCount = await SchoolClass.query()
      .where('code', 'G1')
      .where('schoolId', school.id)
      .count('* as total')
    assert.equal(
      Number(classCount[0].$extras.total),
      1,
      'Duplicate class code should not be created'
    )
  })

  test('duplicate subject code rejected within same school', async ({ client, assert }) => {
    const school = await SchoolFactory.create()
    const user = await UserFactory.create()
    await user.related('schools').attach([school.id])

    await SubjectFactory.merge({
      schoolId: school.id,
      code: 'MATH',
    }).create()

    await client
      .post('/academics/subjects')
      .loginAs(user)
      .withCsrfToken()
      .withSession({ schoolId: school.id })
      .form({
        name: 'Advanced Mathematics',
        code: 'MATH', // Duplicate code
      })

    // Verify duplicate was not created
    const subjectCount = await Subject.query()
      .where('code', 'MATH')
      .where('schoolId', school.id)
      .count('* as total')
    assert.equal(
      Number(subjectCount[0].$extras.total),
      1,
      'Duplicate subject code should not be created'
    )
  })

  test('can update class name if unique within school', async ({ client, assert }) => {
    const school = await SchoolFactory.create()
    const user = await UserFactory.create()
    await user.related('schools').attach([school.id])

    const schoolClass = await SchoolClassFactory.merge({
      schoolId: school.id,
      name: 'Grade 1',
    }).create()

    const response = await client
      .put(`/academics/classes/${schoolClass.id}`)
      .loginAs(user)
      .withCsrfToken()
      .withSession({ schoolId: school.id })
      .form({
        name: 'Grade 1 Updated',
      })

    response.assertRedirectsTo('/academics/classes')

    await schoolClass.refresh()
    assert.equal(schoolClass.name, 'Grade 1 Updated')
  })

  test('cannot update class name to existing name in same school', async ({ client, assert }) => {
    const school = await SchoolFactory.create()
    const user = await UserFactory.create()
    await user.related('schools').attach([school.id])

    await SchoolClassFactory.merge({
      schoolId: school.id,
      name: 'Grade 2',
    }).create()

    const class1 = await SchoolClassFactory.merge({
      schoolId: school.id,
      name: 'Grade 1',
    }).create()

    await client
      .put(`/academics/classes/${class1.id}`)
      .loginAs(user)
      .withCsrfToken()
      .withSession({ schoolId: school.id })
      .form({
        name: 'Grade 2', // Duplicate
      })

    // Verify name wasn't changed (update should have been prevented)
    await class1.refresh()
    assert.equal(class1.name, 'Grade 1')
  })

  test('removing subject from class deletes pivot entry', async ({ client, assert }) => {
    const school = await SchoolFactory.create()
    const user = await UserFactory.create()
    await user.related('schools').attach([school.id])

    const subject = await SubjectFactory.merge({ schoolId: school.id }).create()
    const schoolClass = await SchoolClassFactory.merge({ schoolId: school.id }).create()

    // Assign subject to class
    await subject.related('classes').attach({
      [schoolClass.id]: {
        school_id: school.id,
        periods_per_week: 5,
      },
    })

    // Route is /academics/subjects/:subjectId/class/:classId (singular 'class')
    await client
      .delete(`/academics/subjects/${subject.id}/class/${schoolClass.id}`)
      .loginAs(user)
      .withCsrfToken()
      .withSession({ schoolId: school.id })

    // Verify pivot entry was deleted
    const pivotCount = await db
      .from('class_subjects')
      .where('class_id', schoolClass.id)
      .where('subject_id', subject.id)
      .count('* as total')
      .first()

    assert.equal(Number(pivotCount?.total), 0)
  })
})

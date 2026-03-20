import { test } from '@japa/runner'
import { UserFactory } from '#tests/factories/user_factory'
import { SchoolFactory } from '#tests/factories/school_factory'
import { SchoolClassFactory } from '#tests/factories/school_class_factory'
import { SubjectFactory } from '#tests/factories/subject_factory'
import { SectionFactory } from '#tests/factories/section_factory'
import SchoolClass from '#models/school_class'
import Section from '#models/section'

test.group('Academics Multi-Tenancy Security', (group) => {
  group.tap((t) => t.tags(['@security', '@multi-tenancy']))

  test('user cannot create section for class in different school', async ({ client, assert }) => {
    const school1 = await SchoolFactory.create()
    const school2 = await SchoolFactory.create()
    const user = await UserFactory.create()
    await user.related('schools').attach([school1.id])

    const classInSchool2 = await SchoolClassFactory.merge({
      schoolId: school2.id,
    }).create()

    const response = await client
      .post(`/academics/classes/${classInSchool2.id}/sections`)
      .loginAs(user)
      .withCsrfToken()
      .withSession({ schoolId: school1.id })
      .form({
        classId: classInSchool2.id, // Different school!
        name: 'Hacked Section',
      })

    // Should return 404 as class is not found in user's school context
    response.assertStatus(404)

    // Verify section was NOT created
    const sections = await Section.query().where('classId', classInSchool2.id)
    assert.lengthOf(sections, 0)
  })

  test('user cannot assign subject to class in different school', async ({ client, assert }) => {
    const school1 = await SchoolFactory.create()
    const school2 = await SchoolFactory.create()
    const user = await UserFactory.create()
    await user.related('schools').attach([school1.id])

    const subject = await SubjectFactory.merge({ schoolId: school1.id }).create()
    const classInSchool2 = await SchoolClassFactory.merge({ schoolId: school2.id }).create()

    const response = await client
      .post(`/academics/subjects/${subject.id}/assign-to-class`)
      .loginAs(user)
      .withCsrfToken()
      .withSession({ schoolId: school1.id })
      .form({
        classId: classInSchool2.id, // Cross-school assignment!
        subjectId: subject.id,
      })

    // Should return 404 (class not found in school1)
    response.assertStatus(404)

    // Verify assignment was NOT created
    await subject.load('classes')
    assert.lengthOf(subject.classes, 0)
  })

  test('user cannot access classes from different school', async ({ client }) => {
    const school1 = await SchoolFactory.create()
    const school2 = await SchoolFactory.create()
    const user = await UserFactory.create()
    await user.related('schools').attach([school1.id])

    const classInSchool2 = await SchoolClassFactory.merge({ schoolId: school2.id }).create()

    const response = await client
      .get(`/academics/classes/${classInSchool2.id}`)
      .loginAs(user)
      .withCsrfToken()
      .withSession({ schoolId: school1.id })

    response.assertStatus(404)
  })

  test('user cannot update class from different school', async ({ client, assert }) => {
    const school1 = await SchoolFactory.create()
    const school2 = await SchoolFactory.create()
    const user = await UserFactory.create()
    await user.related('schools').attach([school1.id])

    const classInSchool2 = await SchoolClassFactory.merge({
      schoolId: school2.id,
      name: 'Original Name',
    }).create()

    const response = await client
      .put(`/academics/classes/${classInSchool2.id}`)
      .loginAs(user)
      .withCsrfToken()
      .withSession({ schoolId: school1.id })
      .form({
        name: 'Hacked Name',
      })

    response.assertStatus(404)

    // Verify name was NOT changed
    await classInSchool2.refresh()
    assert.equal(classInSchool2.name, 'Original Name')
  })

  test('user cannot delete class from different school', async ({ client, assert }) => {
    const school1 = await SchoolFactory.create()
    const school2 = await SchoolFactory.create()
    const user = await UserFactory.create()
    await user.related('schools').attach([school1.id])

    const classInSchool2 = await SchoolClassFactory.merge({ schoolId: school2.id }).create()

    const response = await client
      .delete(`/academics/classes/${classInSchool2.id}`)
      .loginAs(user)
      .withCsrfToken()
      .withSession({ schoolId: school1.id })

    response.assertStatus(404)

    // Verify class still exists
    const stillExists = await SchoolClass.find(classInSchool2.id)
    assert.exists(stillExists)
  })

  test('duplicate class names allowed across different schools', async ({ client, assert }) => {
    const school1 = await SchoolFactory.create()
    const school2 = await SchoolFactory.create()
    const user1 = await UserFactory.create()
    const user2 = await UserFactory.create()
    await user1.related('schools').attach([school1.id])
    await user2.related('schools').attach([school2.id])

    // Use unique name to avoid conflicts with factory-generated classes
    const uniqueClassName = `Test Class ${Date.now()}`

    // Create class in school 1
    await client
      .post('/academics/classes')
      .loginAs(user1)
      .withCsrfToken()
      .withSession({ schoolId: school1.id })
      .form({ name: uniqueClassName })

    // Same name in school 2 should succeed
    const response = await client
      .post('/academics/classes')
      .loginAs(user2)
      .withCsrfToken()
      .withSession({ schoolId: school2.id })
      .form({ name: uniqueClassName })

    response.assertRedirectsTo('/academics/classes')

    // Query only within the two test schools
    const classes = await SchoolClass.query()
      .where('name', uniqueClassName)
      .whereIn('schoolId', [school1.id, school2.id])
    assert.lengthOf(classes, 2)
  })

  test('duplicate class names rejected within same school', async ({ client, assert }) => {
    const school = await SchoolFactory.create()
    const user = await UserFactory.create()
    await user.related('schools').attach([school.id])

    // Use unique name to avoid conflicts with other tests
    const uniqueClassName = `Duplicate Test ${Date.now()}`

    await SchoolClassFactory.merge({
      schoolId: school.id,
      name: uniqueClassName,
    }).create()

    // Verify the class was created
    const beforeCount = await SchoolClass.query()
      .where('name', uniqueClassName)
      .where('schoolId', school.id)
      .count('* as total')
    assert.equal(Number(beforeCount[0].$extras.total), 1, 'Class should exist before test')

    await client
      .post('/academics/classes')
      .loginAs(user)
      .withCsrfToken()
      .withSession({ schoolId: school.id })
      .form({
        name: uniqueClassName, // Duplicate
      })

    // Check what classes exist after - the key assertion is that the duplicate wasn't created
    const afterCount = await SchoolClass.query()
      .where('name', uniqueClassName)
      .where('schoolId', school.id)
      .count('* as total')

    // Should still be 1 (not 2) - the duplicate was rejected
    assert.equal(Number(afterCount[0].$extras.total), 1, 'Duplicate class should not be created')
  })

  test('user cannot view subjects from different school', async ({ client }) => {
    const school1 = await SchoolFactory.create()
    const school2 = await SchoolFactory.create()
    const user = await UserFactory.create()
    await user.related('schools').attach([school1.id])

    const subjectInSchool2 = await SubjectFactory.merge({ schoolId: school2.id }).create()

    const response = await client
      .get(`/academics/subjects/${subjectInSchool2.id}`)
      .loginAs(user)
      .withCsrfToken()
      .withSession({ schoolId: school1.id })

    response.assertStatus(404)
  })

  test('user cannot delete section from different school', async ({ client, assert }) => {
    const school1 = await SchoolFactory.create()
    const school2 = await SchoolFactory.create()
    const user = await UserFactory.create()
    await user.related('schools').attach([school1.id])

    const classInSchool2 = await SchoolClassFactory.merge({ schoolId: school2.id }).create()
    const sectionInSchool2 = await SectionFactory.merge({
      schoolId: school2.id,
      classId: classInSchool2.id,
    }).create()

    const response = await client
      .delete(`/academics/sections/${sectionInSchool2.id}`)
      .loginAs(user)
      .withCsrfToken()
      .withSession({ schoolId: school1.id })

    response.assertStatus(404)

    // Verify section still exists
    const stillExists = await Section.find(sectionInSchool2.id)
    assert.exists(stillExists)
  })
})

import { test } from '@japa/runner'
import { UserFactory } from '../../factories/user_factory.js'
import { SchoolFactory } from '../../factories/school_factory.js'
import { SchoolClassFactory } from '../../factories/school_class_factory.js'
import { SectionFactory } from '../../factories/section_factory.js'
import SchoolClass from '#models/school_class'
import Section from '#models/section'

test.group('academics/classes', () => {
  // Ensures authenticated user can create a class
  test('authenticated user can create a class', async ({ client, assert }) => {
    const school = await SchoolFactory.create()
    const user = await UserFactory.create()
    await user.related('schools').attach([school.id])

    const classData = {
      name: 'Grade 1',
      code: 'G1',
      displayOrder: 1,
    }

    const response = await client
      .post('/academics/classes')
      .loginAs(user)
      .withCsrfToken()
      .withSession({ schoolId: school.id })
      .form(classData)

    response.assertRedirectsTo('/academics/classes')

    const schoolClass = await SchoolClass.query()
      .where('name', classData.name)
      .where('schoolId', school.id)
      .first()
    assert.exists(schoolClass)
    assert.equal(schoolClass?.code, 'G1')
  })

  // Ensures class can be updated
  test('authenticated user can update a class', async ({ client, assert }) => {
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
      .form({ name: 'Grade 1 Updated', code: 'G1U' })

    response.assertRedirectsTo('/academics/classes')

    await schoolClass.refresh()
    assert.equal(schoolClass.name, 'Grade 1 Updated')
    assert.equal(schoolClass.code, 'G1U')
  })

  // Ensures class can be deleted
  test('authenticated user can delete a class', async ({ client, assert }) => {
    const school = await SchoolFactory.create()
    const user = await UserFactory.create()
    await user.related('schools').attach([school.id])

    const schoolClass = await SchoolClassFactory.merge({
      schoolId: school.id,
    }).create()

    const response = await client
      .delete(`/academics/classes/${schoolClass.id}`)
      .loginAs(user)
      .withCsrfToken()
      .withSession({ schoolId: school.id })

    response.assertRedirectsTo('/academics/classes')

    const deleted = await SchoolClass.find(schoolClass.id)
    assert.isNull(deleted)
  })

  // Ensures section can be added to a class
  test('authenticated user can add a section to a class', async ({ client, assert }) => {
    const school = await SchoolFactory.create()
    const user = await UserFactory.create()
    await user.related('schools').attach([school.id])

    const schoolClass = await SchoolClassFactory.merge({
      schoolId: school.id,
    }).create()

    const sectionData = {
      classId: schoolClass.id,
      name: 'A',
      capacity: 30,
      roomNumber: 'R101',
    }

    const response = await client
      .post('/academics/sections')
      .loginAs(user)
      .withCsrfToken()
      .withSession({ schoolId: school.id })
      .form(sectionData)

    response.assertRedirectsTo(`/academics/classes/${schoolClass.id}`)

    const section = await Section.query()
      .where('classId', schoolClass.id)
      .where('name', 'A')
      .first()
    assert.exists(section)
    assert.equal(section?.classId, schoolClass.id)
    assert.equal(section?.capacity, 30)
  })

  // Ensures section can be deleted
  test('authenticated user can delete a section', async ({ client, assert }) => {
    const school = await SchoolFactory.create()
    const user = await UserFactory.create()
    await user.related('schools').attach([school.id])

    const schoolClass = await SchoolClassFactory.merge({
      schoolId: school.id,
    }).create()

    const section = await SectionFactory.merge({
      schoolId: school.id,
      classId: schoolClass.id,
      name: 'A',
    }).create()

    const response = await client
      .delete(`/academics/sections/${section.id}`)
      .loginAs(user)
      .withCsrfToken()
      .withSession({ schoolId: school.id })

    response.assertRedirectsTo(`/academics/classes/${schoolClass.id}`)

    const deleted = await Section.find(section.id)
    assert.isNull(deleted)
  })
})

import { test } from '@japa/runner'
import { UserFactory } from '../../factories/user_factory.js'
import { SchoolFactory } from '../../factories/school_factory.js'
import { AcademicYearFactory } from '../../factories/academic_year_factory.js'
import AcademicYear from '#models/academic_year'

test.group('academics/academic-years', () => {
  // Ensures authenticated user with school context can create an academic year
  test('authenticated user can create an academic year', async ({ client, assert }) => {
    const school = await SchoolFactory.create()
    const user = await UserFactory.create()
    await user.related('schools').attach([school.id])

    const academicYearData = {
      name: '2024-2025',
      startDate: '2024-04-01',
      endDate: '2025-03-31',
      isCurrent: true,
    }

    const response = await client
      .post('/academics/years')
      .loginAs(user)
      .withCsrfToken()
      .withSession({ schoolId: school.id })
      .form(academicYearData)

    response.assertRedirectsTo('/academics/years')

    const academicYear = await AcademicYear.findBy('name', academicYearData.name)
    assert.exists(academicYear)
    assert.equal(academicYear?.schoolId, school.id)
    assert.equal(academicYear?.isCurrent, true)
  })

  // Ensures only one academic year can be current per school
  test('setting an academic year as current unsets other current years', async ({
    client,
    assert,
  }) => {
    const school = await SchoolFactory.create()
    const user = await UserFactory.create()
    await user.related('schools').attach([school.id])

    // Create first academic year as current
    const firstYear = await AcademicYearFactory.merge({
      schoolId: school.id,
      name: '2023-2024',
      isCurrent: true,
    }).create()

    // Create second academic year as current
    const response = await client
      .post('/academics/years')
      .loginAs(user)
      .withCsrfToken()
      .withSession({ schoolId: school.id })
      .form({
        name: '2024-2025',
        startDate: '2024-04-01',
        endDate: '2025-03-31',
        isCurrent: true,
      })

    response.assertRedirectsTo('/academics/years')

    // Reload first year and check it's no longer current
    await firstYear.refresh()
    assert.equal(firstYear.isCurrent, false)

    // Check new year is current
    const secondYear = await AcademicYear.findBy('name', '2024-2025')
    assert.equal(secondYear?.isCurrent, true)
  })

  // Ensures academic year can be updated
  test('authenticated user can update an academic year', async ({ client, assert }) => {
    const school = await SchoolFactory.create()
    const user = await UserFactory.create()
    await user.related('schools').attach([school.id])

    const academicYear = await AcademicYearFactory.merge({
      schoolId: school.id,
      name: '2024-2025',
    }).create()

    const response = await client
      .put(`/academics/years/${academicYear.id}`)
      .loginAs(user)
      .withCsrfToken()
      .withSession({ schoolId: school.id })
      .form({ name: '2024-2025 Updated' })

    response.assertRedirectsTo('/academics/years')

    await academicYear.refresh()
    assert.equal(academicYear.name, '2024-2025 Updated')
  })

  // Ensures academic year can be deleted
  test('authenticated user can delete an academic year', async ({ client, assert }) => {
    const school = await SchoolFactory.create()
    const user = await UserFactory.create()
    await user.related('schools').attach([school.id])

    const academicYear = await AcademicYearFactory.merge({
      schoolId: school.id,
    }).create()

    const response = await client
      .delete(`/academics/years/${academicYear.id}`)
      .loginAs(user)
      .withCsrfToken()
      .withSession({ schoolId: school.id })

    response.assertRedirectsTo('/academics/years')

    const deleted = await AcademicYear.find(academicYear.id)
    assert.isNull(deleted)
  })

  // Ensures unauthenticated users cannot access academic years
  test('unauthenticated users cannot create academic years', async ({ client }) => {
    const response = await client
      .post('/academics/years')
      .withCsrfToken()
      .form({ name: '2024-2025', startDate: '2024-04-01', endDate: '2025-03-31' })

    response.assertRedirectsTo('/auth/login')
  })
})

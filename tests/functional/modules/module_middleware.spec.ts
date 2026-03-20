import { test } from '@japa/runner'
import { UserFactory } from '../../factories/user_factory.js'
import { SchoolFactory } from '../../factories/school_factory.js'
import Roles from '#enums/roles'

test.group('modules/module_middleware', () => {
  // All module routes are always accessible for authenticated school users
  test('module routes are accessible for authenticated school users', async ({ client }) => {
    const school = await SchoolFactory.create()
    const user = await UserFactory.create()
    await user.related('schools').attach({
      [school.id]: { role_id: Roles.SCHOOL_ADMIN },
    })

    const response = await client
      .get('/fees/categories')
      .loginAs(user)
      .withSession({ schoolId: school.id })
      .withInertia()

    response.assertStatus(200)
  })

  // Basic module routes always succeed
  test('basic module routes always succeed', async ({ client }) => {
    const school = await SchoolFactory.create()
    const user = await UserFactory.create()
    await user.related('schools').attach({
      [school.id]: { role_id: Roles.SCHOOL_ADMIN },
    })

    const response = await client
      .get('/academics/classes')
      .loginAs(user)
      .withSession({ schoolId: school.id })
      .withInertia()

    response.assertStatus(200)
  })

  // Unauthenticated request should be handled by auth middleware
  test('unauthenticated request is handled by auth middleware first', async ({ client }) => {
    const response = await client.get('/fees/categories')
    response.assertRedirectsTo('/auth/login')
  })

  // Reports module route accessible
  test('reports module route is accessible', async ({ client }) => {
    const school = await SchoolFactory.create()
    const user = await UserFactory.create()
    await user.related('schools').attach({
      [school.id]: { role_id: Roles.SCHOOL_ADMIN },
    })

    const response = await client
      .get('/reports')
      .loginAs(user)
      .withSession({ schoolId: school.id })
      .withInertia()

    response.assertStatus(200)
  })
})

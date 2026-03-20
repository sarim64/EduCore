import { test } from '@japa/runner'
import db from '@adonisjs/lucid/services/db'
import { UserFactory } from '../../factories/user_factory.js'
import Roles from '#enums/roles'

test.group('schools', () => {
  // Confirms that an authenticated user can create a school.
  test('authenticated user can create a school', async ({ client, assert }) => {
    const user = await UserFactory.create()
    const schoolData = { name: 'ABC School' }

    const response = await client.post('/schools').loginAs(user).withCsrfToken().form(schoolData)

    response.assertRedirectsTo('/')

    const school = await db.from('schools').where('name', schoolData.name).first()
    assert.exists(school)

    const pivot = await db
      .from('school_users')
      .where('school_id', school!.id)
      .andWhere('user_id', user.id)
      .first()
    assert.exists(pivot)
    assert.equal(pivot!.role_id, Roles.SCHOOL_ADMIN)
  })

  // Ensures that unauthenticated users cannot create a school
  test('unauthenticated users cannot create a school', async ({ client }) => {
    const response = await client
      .post('/schools')
      .withCsrfToken()
      .form({ name: 'Unauthorized School' })

    response.assertRedirectsTo('/auth/login')
  })
})

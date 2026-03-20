import { test } from '@japa/runner'
import { UserFactory } from '../../factories/user_factory.js'
import { SchoolFactory } from '../../factories/school_factory.js'

test.group('auth/login', () => {
  // Verifies that the login page is rendered correctly for unauthenticated users.
  test('GET /auth/login renders login page for guests', async ({ client }) => {
    const response = await client.get('/auth/login').withInertia()
    response.assertStatus(200)
    response.assertInertiaComponent('auth/login')
  })

  // Ensures that a logged-in user can access protected routes with the correct school context.
  test('user can log in and access protected routes with school context', async ({ client }) => {
    const school = await SchoolFactory.create()
    const user = await UserFactory.merge({ password: 'password123' }).create()
    await user.related('schools').attach([school.id])

    await client.post('/auth/login').withCsrfToken().form({
      email: user.email,
      password: 'password123',
    })

    const response = await client.get('/')

    response.assertStatus(200)
  })

  // Confirms that the login process fails gracefully with invalid credentials.
  test('login fails with invalid credentials', async ({ client }) => {
    const response = await client
      .post('/auth/login')
      .withCsrfToken()
      .withInertia()
      .form({ email: 'some@email.com', password: 'wrongpassword' })

    response.assertInertiaPropsContains({ flash: { error: 'Invalid credentials' } })
    response.assertRedirectsTo('/auth/login')
  })

  //Ensures that unauthenticated users cannot access protected routes and are redirected to login.
  test('unauthenticated users are redirected from protected routes', async ({ client }) => {
    const response = await client.get('/')
    response.assertRedirectsTo('/auth/login')
  })
})

import { test } from '@japa/runner'
import User from '#models/user'

test.group('auth/register', () => {
  // Ensures a new user can register successfully and is redirected to the organization creation page.
  test('registers a new user successfully', async ({ client, assert }) => {
    const formData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123',
      passwordConfirmation: 'password123',
    }

    const response = await client
      .post('/auth/register')
      .withInertia()
      .withCsrfToken()
      .form(formData)

    const user = await User.query().where('email', formData.email).first()
    assert.exists(user, 'Expected user to be created')
    assert.equal(user?.firstName, 'John')

    response.assertRedirectsTo('/schools/create')
  })
})

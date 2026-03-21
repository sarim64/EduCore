import { test } from '@japa/runner'
import { UserFactory } from '../../factories/user_factory.js'
import { SuperAdminFactory } from '../../factories/super_admin_factory.js'

test.group('admin/middleware', () => {
  // Verifies that unauthenticated users are redirected to login
  test('unauthenticated users are redirected to login', async ({ client }) => {
    const response = await client.get('/admin')

    response.assertRedirectsTo('/auth/login')
  })

  // Verifies that authenticated users without super admin status get 403
  test('non-super-admin users get 403 forbidden', async ({ client }) => {
    const user = await UserFactory.create()

    const response = await client.get('/admin').loginAs(user)

    response.assertStatus(403)
  })

  // Verifies that active super admins can access admin routes
  test('active super admin can access admin routes', async ({ client }) => {
    const user = await UserFactory.create()
    await SuperAdminFactory.merge({ userId: user.id }).create()

    const response = await client.get('/admin').loginAs(user).withInertia()

    response.assertStatus(200)
    response.assertInertiaComponent('superadmin/dashboard')
  })

  // Verifies that revoked super admins cannot access admin routes
  test('revoked super admin gets 403 forbidden', async ({ client }) => {
    const user = await UserFactory.create()
    await SuperAdminFactory.merge({ userId: user.id }).apply('revoked').create()

    const response = await client.get('/admin').loginAs(user)

    response.assertStatus(403)
  })

  // Verifies that super admin context is attached to the request
  test('super admin context is attached to request', async ({ client }) => {
    const user = await UserFactory.create()
    await SuperAdminFactory.merge({ userId: user.id }).create()

    const response = await client.get('/admin/schools').loginAs(user).withInertia()

    response.assertStatus(200)
    response.assertInertiaComponent('superadmin/schools/index')
  })
})

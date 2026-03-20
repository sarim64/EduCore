import { test } from '@japa/runner'
import { UserFactory } from '../../factories/user_factory.js'
import { SuperAdminFactory } from '../../factories/super_admin_factory.js'
import { SchoolFactory } from '../../factories/school_factory.js'

test.group('admin/access_control', () => {
  // Verifies that super admin can access admin dashboard
  test('super admin can access admin dashboard', async ({ client }) => {
    const user = await UserFactory.create()
    await SuperAdminFactory.merge({ userId: user.id }).create()

    const response = await client.get('/admin').loginAs(user).withInertia()

    response.assertStatus(200)
    response.assertInertiaComponent('admin/dashboard')
  })

  // Verifies that super admin cannot access school routes without school membership
  test('super admin without school membership is redirected to school creation', async ({
    client,
  }) => {
    const user = await UserFactory.create()
    await SuperAdminFactory.merge({ userId: user.id }).create()

    // Try to access school-protected routes (like home which requires school context)
    const response = await client.get('/').loginAs(user)

    response.assertRedirectsTo('/admin')
  })

  // Verifies that super admin with school membership can access school routes
  test('super admin with school membership can access school routes', async ({ client }) => {
    const user = await UserFactory.create()
    await SuperAdminFactory.merge({ userId: user.id }).create()
    const school = await SchoolFactory.create()
    await user.related('schools').attach([school.id])

    const response = await client.get('/').loginAs(user).withSession({ schoolId: school.id })

    response.assertStatus(200)
  })

  // Verifies that regular user with school membership cannot access admin
  test('regular user with school membership cannot access admin', async ({ client }) => {
    const user = await UserFactory.create()
    const school = await SchoolFactory.create()
    await user.related('schools').attach([school.id])

    const response = await client.get('/admin').loginAs(user).withSession({ schoolId: school.id })

    response.assertStatus(403)
  })

  // Verifies that super admin can view audit logs
  test('super admin can view audit logs', async ({ client }) => {
    const user = await UserFactory.create()
    await SuperAdminFactory.merge({ userId: user.id }).create()

    const response = await client.get('/admin/audit-logs').loginAs(user).withInertia()

    response.assertStatus(200)
    response.assertInertiaComponent('admin/audit-logs/index')
  })

  // Verifies that revoked super admin cannot access admin routes
  test('revoked super admin cannot access admin routes', async ({ client }) => {
    const user = await UserFactory.create()
    await SuperAdminFactory.merge({ userId: user.id }).apply('revoked').create()

    const response = await client.get('/admin').loginAs(user)

    response.assertStatus(403)
  })
})

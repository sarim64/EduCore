import { test } from '@japa/runner'
import { UserFactory } from '../../factories/user_factory.js'
import { SuperAdminFactory } from '../../factories/super_admin_factory.js'
import { SchoolFactory } from '../../factories/school_factory.js'
import { SubscriptionPlanFactory } from '../../factories/subscription_plan_factory.js'
import SubscriptionPlan from '#models/subscription_plan'
import SchoolSubscription from '#models/school_subscription'
import { DateTime } from 'luxon'

test.group('admin/subscriptions - plans', () => {
  // Verifies super admin can view subscription plans list
  test('super admin can view subscription plans list', async ({ client }) => {
    const user = await UserFactory.create()
    await SuperAdminFactory.merge({ userId: user.id }).create()

    const response = await client.get('/admin/plans').loginAs(user).withInertia()

    response.assertStatus(200)
    response.assertInertiaComponent('admin/plans/index')
  })

  // Verifies super admin can create a subscription plan
  test('super admin can create a subscription plan', async ({ client, assert }) => {
    const user = await UserFactory.create()
    await SuperAdminFactory.merge({ userId: user.id }).create()

    const response = await client.post('/admin/plans').loginAs(user).withCsrfToken().form({
      name: 'Test Plan',
      code: 'test-plan-create',
      description: 'A test plan',
      priceMonthly: 29.99,
      priceYearly: 299.99,
      maxStudents: 500,
      maxStaff: 50,
    })

    response.assertRedirectsTo('/admin/plans')

    const plan = await SubscriptionPlan.findBy('code', 'test-plan-create')
    assert.exists(plan)
    assert.equal(plan?.name, 'Test Plan')
    assert.equal(plan?.maxStudents, 500)
  })

  // Verifies plan name and code are required
  test('plan name and code are required', async ({ client, assert }) => {
    const user = await UserFactory.create()
    await SuperAdminFactory.merge({ userId: user.id }).create()

    const countBefore = await SubscriptionPlan.query().count('* as total')

    await client.post('/admin/plans').loginAs(user).withCsrfToken().form({})

    // Validation should prevent creation
    const countAfter = await SubscriptionPlan.query().count('* as total')
    assert.equal(countBefore[0].$extras.total, countAfter[0].$extras.total)
  })

  // Verifies plan code must be unique
  test('plan code must be unique', async ({ client, assert }) => {
    const user = await UserFactory.create()
    await SuperAdminFactory.merge({ userId: user.id }).create()

    await SubscriptionPlanFactory.merge({ code: 'unique-test-code' }).create()

    await client.post('/admin/plans').loginAs(user).withCsrfToken().form({
      name: 'Another Plan',
      code: 'unique-test-code',
    })

    // DB unique constraint should prevent creation
    const plans = await SubscriptionPlan.query().where('name', 'Another Plan')
    assert.lengthOf(plans, 0)
  })

  // Verifies super admin can update a subscription plan
  test('super admin can update a subscription plan', async ({ client, assert }) => {
    const user = await UserFactory.create()
    await SuperAdminFactory.merge({ userId: user.id }).create()

    const plan = await SubscriptionPlanFactory.merge({
      name: 'Old Name',
      code: 'update-test-code',
    }).create()

    const response = await client
      .put(`/admin/plans/${plan.id}`)
      .loginAs(user)
      .withCsrfToken()
      .form({ name: 'New Name', priceMonthly: 49.99 })

    response.assertRedirectsTo('/admin/plans')

    await plan.refresh()
    assert.equal(plan.name, 'New Name')
    assert.equal(plan.priceMonthly, 49.99)
  })

  // Verifies super admin can delete a plan with no schools assigned
  test('super admin can delete a plan with no schools assigned', async ({ client, assert }) => {
    const user = await UserFactory.create()
    await SuperAdminFactory.merge({ userId: user.id }).create()

    const plan = await SubscriptionPlanFactory.merge({ code: 'delete-test' }).create()

    const response = await client.delete(`/admin/plans/${plan.id}`).loginAs(user).withCsrfToken()

    response.assertRedirectsTo('/admin/plans')

    const deleted = await SubscriptionPlan.find(plan.id)
    assert.isNull(deleted)
  })

  // Verifies non-super-admin cannot access plans
  test('non-super-admin gets 403 on plans', async ({ client }) => {
    const user = await UserFactory.create()

    const getResponse = await client.get('/admin/plans').loginAs(user)

    getResponse.assertStatus(403)
  })
})

test.group('admin/subscriptions - school subscription', () => {
  // Verifies super admin can assign a plan to a school
  test('super admin can assign a plan to a school', async ({ client, assert }) => {
    const user = await UserFactory.create()
    await SuperAdminFactory.merge({ userId: user.id }).create()
    const school = await SchoolFactory.create()

    const plan = await SubscriptionPlanFactory.merge({
      code: 'assign-test',
    }).create()

    const response = await client
      .post(`/admin/schools/${school.id}/subscription`)
      .loginAs(user)
      .withCsrfToken()
      .form({
        planId: plan.id,
        startDate: '2026-01-01',
      })

    response.assertRedirectsTo(`/admin/schools/${school.id}/subscription`)

    const sub = await SchoolSubscription.query().where('schoolId', school.id).firstOrFail()
    assert.equal(sub.planId, plan.id)
    assert.equal(sub.status, 'active')
  })

  // Verifies custom overrides are preserved
  test('custom overrides are preserved', async ({ client, assert }) => {
    const user = await UserFactory.create()
    await SuperAdminFactory.merge({ userId: user.id }).create()
    const school = await SchoolFactory.create()

    const plan = await SubscriptionPlanFactory.merge({
      code: 'override-test',
      maxStudents: 100,
      maxStaff: 20,
    }).create()

    await client
      .post(`/admin/schools/${school.id}/subscription`)
      .loginAs(user)
      .withCsrfToken()
      .form({
        planId: plan.id,
        startDate: '2026-01-01',
        maxStudents: 200,
        maxStaff: 40,
        customPrice: 19.99,
        notes: 'Special deal for this school',
      })

    const sub = await SchoolSubscription.query().where('schoolId', school.id).firstOrFail()
    assert.equal(sub.maxStudents, 200)
    assert.equal(sub.maxStaff, 40)
    assert.equal(sub.customPrice, 19.99)
    assert.equal(sub.notes, 'Special deal for this school')
  })

  // Verifies non-super-admin cannot access subscription management
  test('non-super-admin gets 403 on subscription', async ({ client }) => {
    const user = await UserFactory.create()
    const school = await SchoolFactory.create()

    const response = await client.get(`/admin/schools/${school.id}/subscription`).loginAs(user)

    response.assertStatus(403)
  })

  // Verifies expired subscription status is recorded correctly
  test('expired subscription status is recorded correctly', async ({ assert }) => {
    const user = await UserFactory.create()
    await SuperAdminFactory.merge({ userId: user.id }).create()
    const school = await SchoolFactory.create()

    const plan = await SubscriptionPlanFactory.merge({
      code: 'expired-test',
    }).create()

    // Create an expired subscription
    await SchoolSubscription.create({
      schoolId: school.id,
      planId: plan.id,
      status: 'expired',
      startDate: DateTime.now().minus({ years: 1 }),
      endDate: DateTime.now().minus({ days: 1 }),
      createdBy: user.id,
    })

    const sub = await SchoolSubscription.query().where('schoolId', school.id).firstOrFail()

    assert.equal(sub.status, 'expired')
    assert.isTrue(sub.isExpired)
  })
})

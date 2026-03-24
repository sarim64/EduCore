import { test } from '@japa/runner'
import { UserFactory } from '../../factories/user_factory.js'
import { SuperAdminFactory } from '../../factories/super_admin_factory.js'
import { SchoolFactory } from '../../factories/school_factory.js'
import { SubscriptionPlanFactory } from '../../factories/subscription_plan_factory.js'
import { SchoolSubscriptionFactory } from '../../factories/school_subscription_factory.js'
import { DateTime } from 'luxon'

test.group('admin/dashboard - stats', () => {
  // Verifies that the dashboard renders with the new stats shape
  test('dashboard renders with new stats shape', async ({ client, assert }) => {
    const user = await UserFactory.create()
    await SuperAdminFactory.merge({ userId: user.id }).create()

    const response = await client.get('/admin').loginAs(user).withInertia()

    response.assertStatus(200)
    response.assertInertiaComponent('superadmin/dashboard')

    const { props } = response.body()
    assert.exists(props.stats)
    assert.isNumber(props.stats.schoolsCount)
    assert.isNumber(props.stats.schoolsThisMonth)
    assert.isNumber(props.stats.activeSubscriptionsCount)
    assert.isNumber(props.stats.expiringSoonCount)
    assert.isNumber(props.stats.totalStudents)
    assert.isArray(props.stats.recentSchools)
    assert.isObject(props.stats.planDistribution)
    assert.isArray(props.stats.expiringSoon)
  })

  // Verifies that the old top-level 'schools' prop is removed
  test('dashboard does not expose schools as a separate top-level prop', async ({
    client,
    assert,
  }) => {
    const user = await UserFactory.create()
    await SuperAdminFactory.merge({ userId: user.id }).create()

    const response = await client.get('/admin').loginAs(user).withInertia()

    const { props } = response.body()
    assert.notProperty(props, 'schools')
  })

  // Verifies schoolsThisMonth increments when a new school is created this month
  test('schoolsThisMonth increments when a school is created this month', async ({
    client,
    assert,
  }) => {
    const user = await UserFactory.create()
    await SuperAdminFactory.merge({ userId: user.id }).create()

    const before = await client.get('/admin').loginAs(user).withInertia()
    const beforeCount = before.body().props.stats.schoolsThisMonth

    await SchoolFactory.create()

    const after = await client.get('/admin').loginAs(user).withInertia()
    assert.equal(after.body().props.stats.schoolsThisMonth, beforeCount + 1)
  })

  // Verifies expiringSoonCount counts subscriptions expiring within 30 days
  test('expiringSoonCount increments for subscription expiring within 30 days', async ({
    client,
    assert,
  }) => {
    const user = await UserFactory.create()
    await SuperAdminFactory.merge({ userId: user.id }).create()

    const before = await client.get('/admin').loginAs(user).withInertia()
    const beforeCount = before.body().props.stats.expiringSoonCount

    const school = await SchoolFactory.create()
    const plan = await SubscriptionPlanFactory.create()
    await SchoolSubscriptionFactory.merge({
      schoolId: school.id,
      planId: plan.id,
      status: 'active',
      endDate: DateTime.now().plus({ days: 15 }),
      createdBy: user.id,
    }).create()

    const after = await client.get('/admin').loginAs(user).withInertia()
    assert.equal(after.body().props.stats.expiringSoonCount, beforeCount + 1)
  })

  // Verifies expiringSoon list includes school with subscription expiring within 30 days
  test('expiringSoon includes school with near-expiry subscription', async ({
    client,
    assert,
  }) => {
    const user = await UserFactory.create()
    await SuperAdminFactory.merge({ userId: user.id }).create()

    const school = await SchoolFactory.create()
    const plan = await SubscriptionPlanFactory.create()
    await SchoolSubscriptionFactory.merge({
      schoolId: school.id,
      planId: plan.id,
      status: 'active',
      endDate: DateTime.now().plus({ days: 10 }),
      createdBy: user.id,
    }).create()

    const response = await client.get('/admin').loginAs(user).withInertia()
    const { props } = response.body()

    const found = props.stats.expiringSoon.find((e: { name: string }) => e.name === school.name)
    assert.exists(found)
    assert.exists(found.expiresAt)
  })

  // Verifies recentSchools lists the most recently created schools
  test('recentSchools includes recently created school', async ({ client, assert }) => {
    const user = await UserFactory.create()
    await SuperAdminFactory.merge({ userId: user.id }).create()

    const school = await SchoolFactory.create()

    const response = await client.get('/admin').loginAs(user).withInertia()
    const { props } = response.body()

    const found = props.stats.recentSchools.find((s: { id: string }) => s.id === school.id)
    assert.exists(found)
  })
})

import { test } from '@japa/runner'
import { UserFactory } from '../../factories/user_factory.js'
import { SuperAdminFactory } from '../../factories/super_admin_factory.js'
import { SchoolFactory } from '../../factories/school_factory.js'
import { SubscriptionPlanFactory } from '../../factories/subscription_plan_factory.js'
import { SchoolSubscriptionFactory } from '../../factories/school_subscription_factory.js'
import { StudentFactory } from '../../factories/student_factory.js'
import { DateTime } from 'luxon'

test.group('admin/schools - list enriched data', () => {
  // Verifies each school in the list has a studentsCount field
  test('schools list includes studentsCount for each school', async ({ client, assert }) => {
    const user = await UserFactory.create()
    await SuperAdminFactory.merge({ userId: user.id }).create()
    const school = await SchoolFactory.create()

    await StudentFactory.merge({ schoolId: school.id }).create()

    const response = await client.get('/admin/schools').loginAs(user).withInertia()
    response.assertStatus(200)

    const { props } = response.body()
    const found = props.schools.find((s: { id: string }) => s.id === school.id)
    assert.exists(found)
    assert.equal(found.studentsCount, 1)
  })

  // Verifies schools list includes active subscription and plan details
  test('schools list includes subscription with plan name and code', async ({
    client,
    assert,
  }) => {
    const user = await UserFactory.create()
    await SuperAdminFactory.merge({ userId: user.id }).create()
    const school = await SchoolFactory.create()
    const plan = await SubscriptionPlanFactory.merge({
      name: 'Basic Plan',
      code: 'basic-list-test',
    }).create()
    await SchoolSubscriptionFactory.merge({
      schoolId: school.id,
      planId: plan.id,
      createdBy: user.id,
    }).create()

    const response = await client.get('/admin/schools').loginAs(user).withInertia()
    response.assertStatus(200)

    const { props } = response.body()
    const found = props.schools.find((s: { id: string }) => s.id === school.id)
    assert.exists(found)
    assert.exists(found.subscription)
    assert.equal(found.subscription.planName, 'Basic Plan')
    assert.equal(found.subscription.planCode, 'basic-list-test')
  })

  // Verifies schools list includes primaryAdmin info
  test('schools list includes primaryAdmin field', async ({ client, assert }) => {
    const user = await UserFactory.create()
    await SuperAdminFactory.merge({ userId: user.id }).create()
    const school = await SchoolFactory.create()

    const response = await client.get('/admin/schools').loginAs(user).withInertia()
    response.assertStatus(200)

    const { props } = response.body()
    const found = props.schools.find((s: { id: string }) => s.id === school.id)
    assert.exists(found)
    assert.property(found, 'primaryAdmin')
  })

  // Verifies suspended school has derived status 'suspended'
  test('suspended school has status suspended in list', async ({ client, assert }) => {
    const user = await UserFactory.create()
    await SuperAdminFactory.merge({ userId: user.id }).create()
    const school = await SchoolFactory.create()
    school.isSuspended = true
    await school.save()

    const response = await client.get('/admin/schools').loginAs(user).withInertia()
    const { props } = response.body()

    const found = props.schools.find((s: { id: string }) => s.id === school.id)
    assert.exists(found)
    assert.equal(found.status, 'suspended')
  })

  // Verifies school with past-endDate active subscription is derived as expired
  test('school with expired subscription end date has status expired', async ({
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
      endDate: DateTime.now().minus({ days: 10 }),
      createdBy: user.id,
    }).create()

    const response = await client.get('/admin/schools').loginAs(user).withInertia()
    const { props } = response.body()

    const found = props.schools.find((s: { id: string }) => s.id === school.id)
    assert.exists(found)
    assert.equal(found.status, 'expired')
  })

  // Verifies school with subscription expiring within 30 days has status expiring
  test('school with subscription expiring within 30 days has status expiring', async ({
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
      endDate: DateTime.now().plus({ days: 20 }),
      createdBy: user.id,
    }).create()

    const response = await client.get('/admin/schools').loginAs(user).withInertia()
    const { props } = response.body()

    const found = props.schools.find((s: { id: string }) => s.id === school.id)
    assert.exists(found)
    assert.equal(found.status, 'expiring')
  })
})

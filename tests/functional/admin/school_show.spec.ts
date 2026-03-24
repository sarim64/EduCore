import { test } from '@japa/runner'
import { UserFactory } from '../../factories/user_factory.js'
import { SuperAdminFactory } from '../../factories/super_admin_factory.js'
import { SchoolFactory } from '../../factories/school_factory.js'
import { SubscriptionPlanFactory } from '../../factories/subscription_plan_factory.js'
import { SchoolSubscriptionFactory } from '../../factories/school_subscription_factory.js'
import { StudentFactory } from '../../factories/student_factory.js'
import { DateTime } from 'luxon'

test.group('admin/schools - show page props', () => {
  // Verifies that the show page returns a subscriptions history array
  test('school show includes subscriptions history as separate prop', async ({
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
      createdBy: user.id,
    }).create()

    const response = await client
      .get(`/admin/schools/${school.id}`)
      .loginAs(user)
      .withInertia()

    response.assertStatus(200)
    response.assertInertiaComponent('superadmin/schools/show')

    const { props } = response.body()
    assert.isArray(props.subscriptions)
    assert.lengthOf(props.subscriptions, 1)
    assert.equal(props.subscriptions[0].status, 'active')
  })

  // Verifies subscriptions history contains all historical rows (not just active)
  test('school show subscriptions includes expired entries', async ({ client, assert }) => {
    const user = await UserFactory.create()
    await SuperAdminFactory.merge({ userId: user.id }).create()
    const school = await SchoolFactory.create()
    const plan = await SubscriptionPlanFactory.create()

    await SchoolSubscriptionFactory.merge({
      schoolId: school.id,
      planId: plan.id,
      status: 'expired',
      startDate: DateTime.now().minus({ years: 2 }),
      endDate: DateTime.now().minus({ years: 1 }),
      createdBy: user.id,
    }).create()

    await SchoolSubscriptionFactory.merge({
      schoolId: school.id,
      planId: plan.id,
      status: 'active',
      startDate: DateTime.now().minus({ years: 1 }),
      createdBy: user.id,
    }).create()

    const response = await client
      .get(`/admin/schools/${school.id}`)
      .loginAs(user)
      .withInertia()

    const { props } = response.body()
    assert.isArray(props.subscriptions)
    assert.lengthOf(props.subscriptions, 2)
  })

  // Verifies that the show page includes studentsCount as a prop
  test('school show includes studentsCount prop', async ({ client, assert }) => {
    const user = await UserFactory.create()
    await SuperAdminFactory.merge({ userId: user.id }).create()
    const school = await SchoolFactory.create()

    await StudentFactory.merge({ schoolId: school.id }).create()
    await StudentFactory.merge({ schoolId: school.id }).create()

    const response = await client
      .get(`/admin/schools/${school.id}`)
      .loginAs(user)
      .withInertia()

    const { props } = response.body()
    assert.equal(props.studentsCount, 2)
  })

  // Verifies subscription history entries have plan details preloaded
  test('subscription history entries include plan name', async ({ client, assert }) => {
    const user = await UserFactory.create()
    await SuperAdminFactory.merge({ userId: user.id }).create()
    const school = await SchoolFactory.create()
    const plan = await SubscriptionPlanFactory.merge({ name: 'Enterprise Plan', code: 'enterprise' }).create()

    await SchoolSubscriptionFactory.merge({
      schoolId: school.id,
      planId: plan.id,
      createdBy: user.id,
    }).create()

    const response = await client
      .get(`/admin/schools/${school.id}`)
      .loginAs(user)
      .withInertia()

    const { props } = response.body()
    assert.equal(props.subscriptions[0].plan.name, 'Enterprise Plan')
    assert.equal(props.subscriptions[0].plan.code, 'enterprise')
  })
})

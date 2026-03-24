import { test } from '@japa/runner'
import { UserFactory } from '../../factories/user_factory.js'
import { SuperAdminFactory } from '../../factories/super_admin_factory.js'
import { SchoolFactory } from '../../factories/school_factory.js'
import { SubscriptionPlanFactory } from '../../factories/subscription_plan_factory.js'
import { SchoolSubscriptionFactory } from '../../factories/school_subscription_factory.js'
import SchoolSubscription from '#models/school_subscription'
import AdminAuditLog from '#models/admin_audit_log'
import { DateTime } from 'luxon'

test.group('admin/schools - extend subscription', () => {
  // Verifies that extending creates a new subscription row
  test('extending a subscription creates a new subscription row', async ({
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
      endDate: DateTime.now().plus({ days: 30 }),
      createdBy: user.id,
    }).create()

    const countBefore = await SchoolSubscription.query()
      .where('schoolId', school.id)
      .count('* as total')

    await client
      .post(`/admin/schools/${school.id}/extend`)
      .loginAs(user)
      .withCsrfToken()
      .form({ endDate: '2027-12-31' })

    const countAfter = await SchoolSubscription.query()
      .where('schoolId', school.id)
      .count('* as total')

    assert.equal(Number(countAfter[0].$extras.total), Number(countBefore[0].$extras.total) + 1)
  })

  // Verifies that the old subscription is marked expired after extending
  test('extending a subscription marks the old subscription as expired', async ({
    client,
    assert,
  }) => {
    const user = await UserFactory.create()
    await SuperAdminFactory.merge({ userId: user.id }).create()
    const school = await SchoolFactory.create()
    const plan = await SubscriptionPlanFactory.create()

    const oldSub = await SchoolSubscriptionFactory.merge({
      schoolId: school.id,
      planId: plan.id,
      status: 'active',
      endDate: DateTime.now().plus({ days: 30 }),
      createdBy: user.id,
    }).create()

    await client
      .post(`/admin/schools/${school.id}/extend`)
      .loginAs(user)
      .withCsrfToken()
      .form({ endDate: '2027-12-31' })

    await oldSub.refresh()
    assert.equal(oldSub.status, 'expired')
  })

  // Verifies new subscription has the correct endDate
  test('new subscription has the requested endDate', async ({ client, assert }) => {
    const user = await UserFactory.create()
    await SuperAdminFactory.merge({ userId: user.id }).create()
    const school = await SchoolFactory.create()
    const plan = await SubscriptionPlanFactory.create()

    await SchoolSubscriptionFactory.merge({
      schoolId: school.id,
      planId: plan.id,
      status: 'active',
      endDate: DateTime.now().plus({ days: 30 }),
      createdBy: user.id,
    }).create()

    await client
      .post(`/admin/schools/${school.id}/extend`)
      .loginAs(user)
      .withCsrfToken()
      .form({ endDate: '2027-06-30' })

    const newSub = await SchoolSubscription.query()
      .where('schoolId', school.id)
      .where('status', 'active')
      .firstOrFail()

    assert.equal(newSub.endDate?.toISODate(), '2027-06-30')
  })

  // Verifies new subscription startDate matches the old subscription endDate
  test('new subscription startDate matches the old subscription endDate', async ({
    client,
    assert,
  }) => {
    const user = await UserFactory.create()
    await SuperAdminFactory.merge({ userId: user.id }).create()
    const school = await SchoolFactory.create()
    const plan = await SubscriptionPlanFactory.create()
    const oldEndDate = DateTime.fromISO('2027-03-31')

    await SchoolSubscriptionFactory.merge({
      schoolId: school.id,
      planId: plan.id,
      status: 'active',
      endDate: oldEndDate,
      createdBy: user.id,
    }).create()

    await client
      .post(`/admin/schools/${school.id}/extend`)
      .loginAs(user)
      .withCsrfToken()
      .form({ endDate: '2028-03-31' })

    const newSub = await SchoolSubscription.query()
      .where('schoolId', school.id)
      .where('status', 'active')
      .firstOrFail()

    assert.equal(newSub.startDate.toISODate(), '2027-03-31')
  })

  // Verifies extend creates an audit log entry
  test('extending a subscription creates an audit log entry', async ({ client, assert }) => {
    const user = await UserFactory.create()
    await SuperAdminFactory.merge({ userId: user.id }).create()
    const school = await SchoolFactory.create()
    const plan = await SubscriptionPlanFactory.create()

    await SchoolSubscriptionFactory.merge({
      schoolId: school.id,
      planId: plan.id,
      status: 'active',
      endDate: DateTime.now().plus({ days: 30 }),
      createdBy: user.id,
    }).create()

    await client
      .post(`/admin/schools/${school.id}/extend`)
      .loginAs(user)
      .withCsrfToken()
      .form({ endDate: '2027-12-31', notes: 'Renewed for another year' })

    const auditLog = await AdminAuditLog.query()
      .where('targetSchoolId', school.id)
      .whereILike('description', '%Subscription extended%')
      .first()
    assert.exists(auditLog)
  })

  // Verifies non-super-admin cannot extend a subscription
  test('non-super-admin cannot extend a subscription', async ({ client }) => {
    const user = await UserFactory.create()
    const school = await SchoolFactory.create()

    const response = await client
      .post(`/admin/schools/${school.id}/extend`)
      .loginAs(user)
      .withCsrfToken()
      .form({ endDate: '2027-12-31' })

    response.assertStatus(403)
  })
})

import { test } from '@japa/runner'
import { SchoolFactory } from '../../factories/school_factory.js'
import SchoolSubscription from '#models/school_subscription'
import ModuleService from '#services/module_service'
import { DateTime } from 'luxon'

test.group('modules/subscription_expiry', () => {
  // hasActiveSubscription returns true for active subscription
  test('hasActiveSubscription returns true for active subscription', async ({ assert }) => {
    const school = await SchoolFactory.create()

    await SchoolSubscription.create({
      schoolId: school.id,
      status: 'active',
      startDate: DateTime.now().minus({ months: 1 }),
      endDate: DateTime.now().plus({ months: 6 }),
    })

    const result = await ModuleService.hasActiveSubscription(school.id)
    assert.isTrue(result)
  })

  // hasActiveSubscription returns false for expired subscription
  test('hasActiveSubscription returns false for expired subscription', async ({ assert }) => {
    const school = await SchoolFactory.create()

    await SchoolSubscription.create({
      schoolId: school.id,
      status: 'active',
      startDate: DateTime.now().minus({ years: 1 }),
      endDate: DateTime.now().minus({ days: 1 }),
    })

    const result = await ModuleService.hasActiveSubscription(school.id)
    assert.isFalse(result)
  })

  // hasActiveSubscription returns false for cancelled subscription
  test('hasActiveSubscription returns false for cancelled subscription', async ({ assert }) => {
    const school = await SchoolFactory.create()

    await SchoolSubscription.create({
      schoolId: school.id,
      status: 'cancelled',
      startDate: DateTime.now().minus({ months: 1 }),
      endDate: DateTime.now().plus({ months: 6 }),
    })

    const result = await ModuleService.hasActiveSubscription(school.id)
    assert.isFalse(result)
  })

  // hasActiveSubscription returns false when no subscription exists
  test('hasActiveSubscription returns false when no subscription', async ({ assert }) => {
    const school = await SchoolFactory.create()

    const result = await ModuleService.hasActiveSubscription(school.id)
    assert.isFalse(result)
  })

  // Subscription with null endDate (no expiry) is treated as active
  test('subscription with null endDate is treated as active', async ({ assert }) => {
    const school = await SchoolFactory.create()

    await SchoolSubscription.create({
      schoolId: school.id,
      status: 'active',
      startDate: DateTime.now().minus({ months: 1 }),
      endDate: null,
    })

    const result = await ModuleService.hasActiveSubscription(school.id)
    assert.isTrue(result)
  })
})

import { test } from '@japa/runner'
import { SchoolFactory } from '../../factories/school_factory.js'
import SchoolSubscription from '#models/school_subscription'
import ModuleService from '#services/module_service'
import Modules from '#enums/modules'
import { DateTime } from 'luxon'

test.group('modules/module_service', () => {
  // All modules are always enabled
  test('isModuleEnabled always returns true', async ({ assert }) => {
    const school = await SchoolFactory.create()
    const enabled = await ModuleService.isModuleEnabled(school.id, Modules.FEES)
    assert.isTrue(enabled)
  })

  // getEnabledModules returns all modules
  test('getEnabledModules returns all modules', async ({ assert }) => {
    const school = await SchoolFactory.create()
    const enabledModules = await ModuleService.getEnabledModules(school.id)
    assert.includeMembers(enabledModules, Object.values(Modules))
    assert.lengthOf(enabledModules, Object.values(Modules).length)
  })

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

  // hasActiveSubscription returns false when no subscription
  test('hasActiveSubscription returns false when no subscription', async ({ assert }) => {
    const school = await SchoolFactory.create()
    const result = await ModuleService.hasActiveSubscription(school.id)
    assert.isFalse(result)
  })
})

import factory from '@adonisjs/lucid/factories'
import SchoolSubscription from '#models/school_subscription'
import { DateTime } from 'luxon'
import { SchoolFactory } from './school_factory.js'
import { SubscriptionPlanFactory } from './subscription_plan_factory.js'

export const SchoolSubscriptionFactory = factory
  .define(SchoolSubscription, async () => {
    return {
      status: 'active',
      startDate: DateTime.now(),
      endDate: DateTime.now().plus({ years: 1 }),
    }
  })
  .relation('school', () => SchoolFactory)
  .relation('plan', () => SubscriptionPlanFactory)
  .build()

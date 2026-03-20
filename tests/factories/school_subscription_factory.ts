import factory from '@adonisjs/lucid/factories'
import SchoolSubscription from '#models/school_subscription'
import { DateTime } from 'luxon'

export const SchoolSubscriptionFactory = factory
  .define(SchoolSubscription, async () => {
    return {
      status: 'active',
      startDate: DateTime.now(),
      endDate: DateTime.now().plus({ years: 1 }),
    }
  })
  .build()

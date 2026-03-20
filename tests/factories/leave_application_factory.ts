import factory from '@adonisjs/lucid/factories'
import LeaveApplication from '#models/leave_application'
import { DateTime } from 'luxon'

export const LeaveApplicationFactory = factory
  .define(LeaveApplication, async ({ faker }) => {
    const startDate = DateTime.fromJSDate(faker.date.soon({ days: 30 }))
    const endDate = startDate.plus({ days: faker.number.int({ min: 1, max: 5 }) })

    return {
      startDate,
      endDate,
      totalDays: Math.ceil(endDate.diff(startDate, 'days').days) + 1,
      reason: faker.lorem.paragraph(),
      status: faker.helpers.arrayElement(['pending', 'approved', 'rejected', 'cancelled'] as const),
      appliedOn: DateTime.now(),
    }
  })
  .build()

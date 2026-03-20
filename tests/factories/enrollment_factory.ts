import factory from '@adonisjs/lucid/factories'
import Enrollment from '#models/enrollment'
import { DateTime } from 'luxon'

export const EnrollmentFactory = factory
  .define(Enrollment, async ({ faker }) => {
    return {
      rollNumber: faker.string.alphanumeric(5).toUpperCase(),
      enrollmentDate: DateTime.now(),
      status: 'active',
    }
  })
  .build()

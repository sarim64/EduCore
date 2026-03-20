import factory from '@adonisjs/lucid/factories'
import AcademicYear from '#models/academic_year'
import { DateTime } from 'luxon'

export const AcademicYearFactory = factory
  .define(AcademicYear, async ({ faker }) => {
    const year = faker.number.int({ min: 2020, max: 2030 })
    return {
      name: `${year}-${year + 1}`,
      startDate: DateTime.fromObject({ year, month: 4, day: 1 }),
      endDate: DateTime.fromObject({ year: year + 1, month: 3, day: 31 }),
      isCurrent: false,
    }
  })
  .build()

import factory from '@adonisjs/lucid/factories'
import StaffAttendance from '#models/staff_attendance'
import { DateTime } from 'luxon'

export const StaffAttendanceFactory = factory
  .define(StaffAttendance, async ({ faker }) => {
    return {
      date: DateTime.fromJSDate(faker.date.recent({ days: 30 })),
      status: faker.helpers.arrayElement([
        'present',
        'absent',
        'late',
        'on_leave',
        'half_day',
      ] as const),
      checkInTime: faker.datatype.boolean() ? '09:00' : null,
      checkOutTime: faker.datatype.boolean() ? '17:00' : null,
      remarks: faker.datatype.boolean() ? faker.lorem.sentence() : null,
    }
  })
  .build()

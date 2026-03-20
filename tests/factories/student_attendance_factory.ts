import factory from '@adonisjs/lucid/factories'
import StudentAttendance from '#models/student_attendance'
import { DateTime } from 'luxon'

export const StudentAttendanceFactory = factory
  .define(StudentAttendance, async ({ faker }) => {
    return {
      date: DateTime.fromJSDate(faker.date.recent({ days: 30 })),
      status: faker.helpers.arrayElement([
        'present',
        'absent',
        'late',
        'excused',
        'half_day',
      ] as const),
      remarks: faker.datatype.boolean() ? faker.lorem.sentence() : null,
    }
  })
  .build()

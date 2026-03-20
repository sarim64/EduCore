import factory from '@adonisjs/lucid/factories'
import LeaveType from '#models/leave_type'

export const LeaveTypeFactory = factory
  .define(LeaveType, async ({ faker }) => {
    return {
      name: faker.helpers.arrayElement([
        'Sick Leave',
        'Casual Leave',
        'Annual Leave',
        'Maternity Leave',
      ]),
      code: faker.string.alpha({ length: 4 }).toUpperCase(),
      description: faker.lorem.sentence(),
      allowedDays: faker.number.int({ min: 5, max: 30 }),
      isPaid: faker.datatype.boolean(),
      isActive: true,
      appliesTo: faker.helpers.arrayElement(['all', 'teaching', 'non_teaching'] as const),
    }
  })
  .build()

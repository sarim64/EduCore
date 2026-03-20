import factory from '@adonisjs/lucid/factories'
import Designation from '#models/designation'

export const DesignationFactory = factory
  .define(Designation, async ({ faker }) => {
    return {
      name: faker.helpers.arrayElement([
        'Senior Teacher',
        'Junior Teacher',
        'Head of Department',
        'Lab Assistant',
        'Coordinator',
        'Office Assistant',
        'Accountant',
        'Librarian',
      ]),
      description: faker.lorem.sentence(),
      isActive: true,
    }
  })
  .build()

import factory from '@adonisjs/lucid/factories'
import Department from '#models/department'

export const DepartmentFactory = factory
  .define(Department, async ({ faker }) => {
    return {
      name: faker.helpers.arrayElement([
        'Mathematics',
        'Science',
        'English',
        'Social Studies',
        'Physical Education',
        'Arts',
        'Computer Science',
        'Administration',
      ]),
      description: faker.lorem.sentence(),
      isActive: true,
    }
  })
  .build()

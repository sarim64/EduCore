import factory from '@adonisjs/lucid/factories'
import StaffQualification from '#models/staff_qualification'

export const StaffQualificationFactory = factory
  .define(StaffQualification, async ({ faker }) => {
    return {
      degree: faker.helpers.arrayElement([
        'B.Ed',
        'M.Ed',
        'B.Sc',
        'M.Sc',
        'B.A',
        'M.A',
        'Ph.D',
        'MBA',
      ]),
      fieldOfStudy: faker.helpers.arrayElement([
        'Education',
        'Mathematics',
        'Physics',
        'Chemistry',
        'Biology',
        'English',
        'Computer Science',
      ]),
      institution: faker.company.name() + ' University',
      year: faker.number.int({ min: 1990, max: 2023 }),
      grade: faker.helpers.arrayElement(['A', 'A-', 'B+', 'B', 'B-', 'C+']),
      certificateUrl: null,
    }
  })
  .build()

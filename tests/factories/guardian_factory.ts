import factory from '@adonisjs/lucid/factories'
import Guardian from '#models/guardian'

export const GuardianFactory = factory
  .define(Guardian, async ({ faker }) => {
    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      relation: faker.helpers.arrayElement(['father', 'mother', 'guardian', 'uncle', 'aunt']),
      email: faker.internet.email(),
      phone: faker.string.numeric(10),
      alternatePhone: faker.string.numeric(10),
      address: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      postalCode: faker.location.zipCode(),
      country: faker.location.country(),
      occupation: faker.person.jobTitle(),
      workplace: faker.company.name(),
    }
  })
  .build()

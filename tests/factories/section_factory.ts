import factory from '@adonisjs/lucid/factories'
import Section from '#models/section'

export const SectionFactory = factory
  .define(Section, async ({ faker }) => {
    return {
      name: faker.helpers.arrayElement(['A', 'B', 'C', 'D']),
      capacity: faker.number.int({ min: 20, max: 50 }),
      roomNumber: `R${faker.number.int({ min: 100, max: 500 })}`,
    }
  })
  .build()

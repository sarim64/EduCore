import factory from '@adonisjs/lucid/factories'
import SchoolClass from '#models/school_class'

export const SchoolClassFactory = factory
  .define(SchoolClass, async ({ faker }) => {
    const grade = faker.number.int({ min: 1, max: 12 })
    return {
      name: `Grade ${grade}`,
      code: `G${grade}`,
      displayOrder: grade,
      description: null,
    }
  })
  .build()

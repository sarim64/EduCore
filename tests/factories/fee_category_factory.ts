import factory from '@adonisjs/lucid/factories'
import FeeCategory from '#models/fee_category'
import { SchoolFactory } from './school_factory.js'

export const FeeCategoryFactory = factory
  .define(FeeCategory, async ({ faker }) => {
    return {
      name: faker.helpers.arrayElement([
        'Tuition Fee',
        'Transport Fee',
        'Lab Fee',
        'Library Fee',
        'Sports Fee',
        'Examination Fee',
        'Admission Fee',
        'Building Fund',
      ]),
      code: faker.string.alphanumeric(4).toUpperCase(),
      description: faker.lorem.sentence(),
      isMandatory: faker.datatype.boolean(),
      isActive: true,
      displayOrder: faker.number.int({ min: 1, max: 10 }),
    }
  })
  .relation('school', () => SchoolFactory)
  .build()

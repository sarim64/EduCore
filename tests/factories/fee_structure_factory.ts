import factory from '@adonisjs/lucid/factories'
import FeeStructure from '#models/fee_structure'
import FeeFrequency from '#enums/fee_frequency'
import { SchoolFactory } from './school_factory.js'
import { AcademicYearFactory } from './academic_year_factory.js'
import { SchoolClassFactory } from './school_class_factory.js'
import { FeeCategoryFactory } from './fee_category_factory.js'

export const FeeStructureFactory = factory
  .define(FeeStructure, async ({ faker }) => {
    return {
      amount: faker.number.float({ min: 500, max: 10000, fractionDigits: 2 }),
      frequency: faker.helpers.arrayElement(Object.values(FeeFrequency)),
      lateFeeAmount: faker.number.float({ min: 0, max: 500, fractionDigits: 2 }),
      lateFeePercentage: faker.number.float({ min: 0, max: 10, fractionDigits: 2 }),
      gracePeriodDays: faker.number.int({ min: 0, max: 15 }),
      dueDayOfMonth: faker.number.int({ min: 1, max: 28 }),
      isActive: true,
    }
  })
  .relation('school', () => SchoolFactory)
  .relation('academicYear', () => AcademicYearFactory)
  .relation('class', () => SchoolClassFactory)
  .relation('feeCategory', () => FeeCategoryFactory)
  .build()

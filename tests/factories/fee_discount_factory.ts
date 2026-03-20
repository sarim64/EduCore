import factory from '@adonisjs/lucid/factories'
import FeeDiscount from '#models/fee_discount'
import DiscountType from '#enums/discount_type'
import { SchoolFactory } from './school_factory.js'

export const FeeDiscountFactory = factory
  .define(FeeDiscount, async ({ faker }) => {
    const discountType = faker.helpers.arrayElement(Object.values(DiscountType))
    return {
      name: faker.helpers.arrayElement([
        'Sibling Discount',
        'Merit Scholarship',
        'Staff Child Discount',
        'Early Bird Discount',
        'Need-based Scholarship',
      ]),
      code: faker.string.alphanumeric(4).toUpperCase(),
      description: faker.lorem.sentence(),
      discountType,
      value:
        discountType === DiscountType.PERCENTAGE
          ? faker.number.float({ min: 5, max: 50, fractionDigits: 2 })
          : faker.number.float({ min: 500, max: 5000, fractionDigits: 2 }),
      criteria: faker.helpers.arrayElement(['sibling', 'merit', 'staff_child', 'scholarship']),
      maxBeneficiaries: faker.helpers.maybe(() => faker.number.int({ min: 10, max: 100 })),
      isActive: true,
    }
  })
  .relation('school', () => SchoolFactory)
  .build()

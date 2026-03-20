import factory from '@adonisjs/lucid/factories'
import FeeChallanItem from '#models/fee_challan_item'
import { FeeChallanFactory } from './fee_challan_factory.js'
import { FeeCategoryFactory } from './fee_category_factory.js'

export const FeeChallanItemFactory = factory
  .define(FeeChallanItem, async ({ faker }) => {
    const amount = faker.number.float({ min: 500, max: 5000, fractionDigits: 2 })
    const discountAmount = faker.number.float({ min: 0, max: amount * 0.2, fractionDigits: 2 })

    return {
      amount,
      discountAmount,
      netAmount: amount - discountAmount,
      description: faker.helpers.maybe(() => faker.lorem.sentence()),
    }
  })
  .relation('feeChallan', () => FeeChallanFactory)
  .relation('feeCategory', () => FeeCategoryFactory)
  .build()

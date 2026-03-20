import factory from '@adonisjs/lucid/factories'
import SubscriptionPlan from '#models/subscription_plan'

export const SubscriptionPlanFactory = factory
  .define(SubscriptionPlan, async ({ faker }) => {
    return {
      name: faker.commerce.productName(),
      code: faker.string.alphanumeric(10).toLowerCase(),
      description: faker.lorem.sentence(),
      priceMonthly: Number.parseFloat(faker.commerce.price({ min: 0, max: 100 })),
      priceYearly: Number.parseFloat(faker.commerce.price({ min: 0, max: 1000 })),
      maxStudents: faker.number.int({ min: 50, max: 1000 }),
      maxStaff: faker.number.int({ min: 10, max: 100 }),
      isActive: true,
    }
  })
  .build()

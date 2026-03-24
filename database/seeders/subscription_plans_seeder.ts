import { BaseSeeder } from '@adonisjs/lucid/seeders'
import SubscriptionPlan from '#models/subscription_plan'

export default class extends BaseSeeder {
  async run() {
    await SubscriptionPlan.updateOrCreateMany('code', [
      {
        name: 'Trial',
        code: 'trial',
        description: 'First 3 months free — full access to all features',
        priceMonthly: 0,
        priceYearly: 0,
        maxStudents: -1,
        maxStaff: -1,
        isActive: true,
      },
      {
        name: 'Basic',
        code: 'basic',
        description: 'Full-featured school management for continuing schools',
        priceMonthly: 2999,
        priceYearly: 29999,
        maxStudents: 500,
        maxStaff: 50,
        isActive: true,
      },
      {
        name: 'Pro',
        code: 'pro',
        description: 'Reserved for future advanced modules',
        priceMonthly: 0,
        priceYearly: 0,
        maxStudents: -1,
        maxStaff: -1,
        isActive: false,
      },
    ])
  }
}

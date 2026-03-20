import { BaseSeeder } from '@adonisjs/lucid/seeders'
import SubscriptionPlan from '#models/subscription_plan'

export default class extends BaseSeeder {
  async run() {
    await SubscriptionPlan.updateOrCreateMany('code', [
      {
        name: 'Free',
        code: 'free',
        description: 'Basic school management with core features',
        priceMonthly: 0,
        priceYearly: 0,
        maxStudents: 100,
        maxStaff: 20,
        isActive: true,
      },
      {
        name: 'Standard',
        code: 'standard',
        description: 'Enhanced management with fee collection and reporting',
        priceMonthly: 29.99,
        priceYearly: 299.99,
        maxStudents: 500,
        maxStaff: 50,
        isActive: true,
      },
      {
        name: 'Premium',
        code: 'premium',
        description: 'Full-featured school management with all modules',
        priceMonthly: 79.99,
        priceYearly: 799.99,
        maxStudents: -1,
        maxStaff: -1,
        isActive: true,
      },
    ])
  }
}

import SubscriptionPlan from '#models/subscription_plan'

export default class ListPlans {
  static async handle() {
    return SubscriptionPlan.query().orderBy('priceMonthly', 'asc')
  }
}

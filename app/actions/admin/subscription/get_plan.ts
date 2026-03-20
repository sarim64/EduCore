import SubscriptionPlan from '#models/subscription_plan'

export default class GetPlan {
  static async handle({ id }: { id: string }) {
    return SubscriptionPlan.findOrFail(id)
  }
}

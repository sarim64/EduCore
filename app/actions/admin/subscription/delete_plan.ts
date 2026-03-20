import SubscriptionPlan from '#models/subscription_plan'
import SchoolSubscription from '#models/school_subscription'
import { Exception } from '@adonisjs/core/exceptions'

type Params = {
  plan: SubscriptionPlan
}

export default class DeletePlan {
  static async handle({ plan }: Params) {
    const assignedCount = await SchoolSubscription.query()
      .where('planId', plan.id)
      .count('* as total')

    const total = Number(assignedCount[0].$extras.total)

    if (total > 0) {
      throw new Exception(
        `Cannot delete plan "${plan.name}" because ${total} school(s) are subscribed to it`,
        { status: 400, code: 'E_PLAN_HAS_SUBSCRIBERS' }
      )
    }

    await plan.delete()
  }
}

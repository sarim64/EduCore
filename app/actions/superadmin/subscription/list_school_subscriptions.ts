import SchoolSubscription from '#models/school_subscription'
import db from '@adonisjs/lucid/services/db'

type Params = {
  page?: number
}

export default class ListSchoolSubscriptions {
  static async handle({ page = 1 }: Params = {}) {
    const [paginator, planCountRows] = await Promise.all([
      SchoolSubscription.query()
        .preload('plan')
        .preload('school')
        .orderBy('createdAt', 'desc')
        .paginate(page, 20),
      db
        .from('school_subscriptions')
        .join('subscription_plans', 'school_subscriptions.plan_id', 'subscription_plans.id')
        .where('school_subscriptions.status', 'active')
        .select('subscription_plans.code')
        .count('* as total')
        .groupBy('subscription_plans.code'),
    ])

    const planCounts: Record<string, number> = {}
    for (const row of planCountRows) {
      planCounts[row.code as string] = Number(row.total)
    }

    return { paginator, planCounts }
  }
}

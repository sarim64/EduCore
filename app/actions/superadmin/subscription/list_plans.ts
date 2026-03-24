import SubscriptionPlan from '#models/subscription_plan'
import db from '@adonisjs/lucid/services/db'

export default class ListPlans {
  static async handle() {
    return SubscriptionPlan.query().orderBy(
      db.raw(`CASE code WHEN 'trial' THEN 0 WHEN 'basic' THEN 1 WHEN 'pro' THEN 2 ELSE 3 END`)
    )
  }
}

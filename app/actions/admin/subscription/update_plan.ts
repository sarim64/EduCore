import SubscriptionPlan from '#models/subscription_plan'
import { updatePlanValidator } from '#validators/subscription'
import { Infer } from '@vinejs/vine/types'

type Params = {
  plan: SubscriptionPlan
  data: Infer<typeof updatePlanValidator>
}

export default class UpdatePlan {
  static async handle({ plan, data }: Params) {
    plan.merge(data)
    await plan.save()
    return plan
  }
}

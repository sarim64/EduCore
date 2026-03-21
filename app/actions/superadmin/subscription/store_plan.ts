import SubscriptionPlan from '#models/subscription_plan'
import { createPlanValidator } from '#validators/subscription'
import { Infer } from '@vinejs/vine/types'

type Params = {
  data: Infer<typeof createPlanValidator>
}

export default class StorePlan {
  static async handle({ data }: Params) {
    return SubscriptionPlan.create({
      ...data,
      isActive: data.isActive ?? true,
    })
  }
}

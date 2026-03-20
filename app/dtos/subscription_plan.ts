import { BaseModelDto } from '@adocasts.com/dto/base'
import SubscriptionPlan from '#models/subscription_plan'

export default class SubscriptionPlanDto extends BaseModelDto {
  declare id: string
  declare name: string
  declare code: string
  declare description: string | null
  declare priceMonthly: number
  declare priceYearly: number
  declare maxStudents: number
  declare maxStaff: number
  declare isActive: boolean
  declare createdAt: string
  declare updatedAt: string | null

  constructor(plan?: SubscriptionPlan) {
    super()

    if (!plan) return
    this.id = plan.id
    this.name = plan.name
    this.code = plan.code
    this.description = plan.description
    this.priceMonthly = plan.priceMonthly
    this.priceYearly = plan.priceYearly
    this.maxStudents = plan.maxStudents
    this.maxStaff = plan.maxStaff
    this.isActive = plan.isActive
    this.createdAt = plan.createdAt.toISO()!
    this.updatedAt = plan.updatedAt?.toISO() ?? null
  }
}

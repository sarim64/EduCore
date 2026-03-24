import { BaseModelDto } from '@adocasts.com/dto/base'
import SchoolSubscription from '#models/school_subscription'
import SubscriptionPlanDto from '#dtos/subscription_plan'

export default class SchoolSubscriptionDto extends BaseModelDto {
  declare id: string
  declare schoolId: string
  declare planId: string | null
  declare status: string
  declare startDate: string
  declare endDate: string | null
  declare maxStudents: number | null
  declare maxStaff: number | null
  declare customPrice: number | null
  declare notes: string | null
  declare createdBy: string | null
  declare createdAt: string
  declare updatedAt: string | null
  declare plan: SubscriptionPlanDto | null
  declare school: { id: string; name: string } | null

  constructor(subscription?: SchoolSubscription) {
    super()

    if (!subscription) return
    this.id = subscription.id
    this.schoolId = subscription.schoolId
    this.planId = subscription.planId
    this.status = subscription.status
    this.startDate = subscription.startDate.toISODate()!
    this.endDate = subscription.endDate?.toISODate() ?? null
    this.maxStudents = subscription.maxStudents
    this.maxStaff = subscription.maxStaff
    this.customPrice = subscription.customPrice
    this.notes = subscription.notes
    this.createdBy = subscription.createdBy
    this.createdAt = subscription.createdAt.toISO()!
    this.updatedAt = subscription.updatedAt?.toISO() ?? null
    this.plan = subscription.plan ? new SubscriptionPlanDto(subscription.plan) : null
    this.school = subscription.school ? { id: subscription.school.id, name: subscription.school.name } : null
  }
}

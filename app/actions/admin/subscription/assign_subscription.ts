import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import School from '#models/school'
import SchoolSubscription from '#models/school_subscription'
import { assignSubscriptionValidator } from '#validators/subscription'
import { Infer } from '@vinejs/vine/types'

type Params = {
  school: School
  data: Infer<typeof assignSubscriptionValidator>
}

@inject()
export default class AssignSubscription {
  constructor(protected ctx: HttpContext) {}

  async handle({ school, data }: Params) {
    const userId = this.ctx.auth.user!.id

    const startDate = DateTime.fromJSDate(data.startDate)
    const endDate = data.endDate ? DateTime.fromJSDate(data.endDate) : null

    // Upsert subscription (one per school)
    let subscription = await SchoolSubscription.query().where('schoolId', school.id).first()

    if (subscription) {
      subscription.merge({
        planId: data.planId,
        startDate,
        endDate,
        maxStudents: data.maxStudents ?? null,
        maxStaff: data.maxStaff ?? null,
        customPrice: data.customPrice ?? null,
        notes: data.notes ?? null,
        status: 'active',
      })
      await subscription.save()
    } else {
      subscription = await SchoolSubscription.create({
        schoolId: school.id,
        planId: data.planId,
        status: 'active',
        startDate,
        endDate,
        maxStudents: data.maxStudents ?? null,
        maxStaff: data.maxStaff ?? null,
        customPrice: data.customPrice ?? null,
        notes: data.notes ?? null,
        createdBy: userId,
      })
    }

    return subscription
  }
}

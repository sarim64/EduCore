import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import School from '#models/school'
import SchoolSubscription from '#models/school_subscription'
import AdminAuditLog from '#models/admin_audit_log'
import { extendSubscriptionValidator } from '#validators/subscription'
import { Infer } from '@vinejs/vine/types'
import db from '@adonisjs/lucid/services/db'

type Params = {
  school: School
  data: Infer<typeof extendSubscriptionValidator>
}

@inject()
export default class ExtendSubscription {
  constructor(protected ctx: HttpContext) {}

  async handle({ school, data }: Params) {
    const superAdmin = this.ctx.superAdmin!
    const newEndDate = DateTime.fromJSDate(data.endDate)

    return db.transaction(async (trx) => {
      // Find the current active subscription
      const currentSub = await SchoolSubscription.query({ client: trx })
        .where('schoolId', school.id)
        .where('status', 'active')
        .orderBy('startDate', 'desc')
        .first()

      // startDate for new subscription is the old endDate (continuation)
      const newStartDate = currentSub?.endDate ?? DateTime.now()

      // Mark the current subscription as expired
      if (currentSub) {
        currentSub.useTransaction(trx)
        currentSub.status = 'expired'
        await currentSub.save()
      }

      // Create the new active subscription
      const newSub = await SchoolSubscription.create(
        {
          schoolId: school.id,
          planId: currentSub?.planId ?? null,
          status: 'active',
          startDate: newStartDate,
          endDate: newEndDate,
          notes: data.notes ?? null,
          createdBy: superAdmin.userId,
        },
        { client: trx }
      )

      await AdminAuditLog.create(
        {
          superAdminId: superAdmin.id,
          action: 'update',
          entityType: 'school_subscription',
          entityId: newSub.id,
          targetSchoolId: school.id,
          newValues: { endDate: newEndDate.toISO(), notes: data.notes ?? null },
          ipAddress: this.ctx.request.ip(),
          userAgent: this.ctx.request.header('user-agent'),
          description: `Subscription extended for school: ${school.name}`,
        },
        { client: trx }
      )

      return newSub
    })
  }
}

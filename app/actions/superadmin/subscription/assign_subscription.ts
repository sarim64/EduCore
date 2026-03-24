import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import School from '#models/school'
import SchoolSubscription from '#models/school_subscription'
import AdminAuditLog from '#models/admin_audit_log'
import { assignSubscriptionValidator } from '#validators/subscription'
import { Infer } from '@vinejs/vine/types'
import db from '@adonisjs/lucid/services/db'

type Params = {
  school: School
  data: Infer<typeof assignSubscriptionValidator>
}

@inject()
export default class AssignSubscription {
  constructor(protected ctx: HttpContext) {}

  async handle({ school, data }: Params) {
    const superAdmin = this.ctx.superAdmin!
    const startDate = DateTime.fromJSDate(data.startDate)
    const endDate = data.endDate ? DateTime.fromJSDate(data.endDate) : null

    return db.transaction(async (trx) => {
      // Expire all currently active subscriptions for this school
      await SchoolSubscription.query({ client: trx })
        .where('schoolId', school.id)
        .where('status', 'active')
        .update({ status: 'expired' })

      // Insert new active subscription
      const subscription = await SchoolSubscription.create(
        {
          schoolId: school.id,
          planId: data.planId,
          status: 'active',
          startDate,
          endDate,
          maxStudents: data.maxStudents ?? null,
          maxStaff: data.maxStaff ?? null,
          customPrice: data.customPrice ?? null,
          notes: data.notes ?? null,
          createdBy: superAdmin.userId,
        },
        { client: trx }
      )

      await AdminAuditLog.create(
        {
          superAdminId: superAdmin.id,
          action: 'assign_subscription',
          entityType: 'school_subscription',
          entityId: subscription.id,
          targetSchoolId: school.id,
          newValues: { planId: data.planId, startDate: startDate.toISO(), endDate: endDate?.toISO() },
          ipAddress: this.ctx.request.ip(),
          userAgent: this.ctx.request.header('user-agent'),
          description: `Assigned subscription to school: ${school.name}`,
        },
        { client: trx }
      )

      return subscription
    })
  }
}

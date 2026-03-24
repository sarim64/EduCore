import School from '#models/school'
import db from '@adonisjs/lucid/services/db'
import Roles from '#enums/roles'
import { DateTime } from 'luxon'

export default class ListSchools {
  static async handle() {
    const now = DateTime.now()
    const thirtyDaysFromNow = now.plus({ days: 30 })

    const schools = await School.query()
      .preload('subscription', (q) => q.preload('plan'))
      .preload('users', (q) => q.pivotColumns(['role_id']))
      .orderBy('createdAt', 'desc')

    // Student counts per school in a single query
    const studentCountRows = await db
      .from('students')
      .select('school_id')
      .count('* as total')
      .groupBy('school_id')

    const studentCountMap = new Map(
      studentCountRows.map((row) => [row.school_id as string, Number(row.total)])
    )

    return schools.map((school) => {
      const studentsCount = studentCountMap.get(school.id) ?? 0

      // Derive status from isSuspended + active subscription endDate
      let status: 'active' | 'expiring' | 'expired' | 'suspended'
      if (school.isSuspended) {
        status = 'suspended'
      } else if (!school.subscription?.endDate) {
        status = 'expired'
      } else {
        const endDate = school.subscription.endDate
        if (endDate < now) {
          status = 'expired'
        } else if (endDate <= thirtyDaysFromNow) {
          status = 'expiring'
        } else {
          status = 'active'
        }
      }

      // Primary admin: first user with SCHOOL_ADMIN role
      const primaryAdminUser = school.users.find(
        (u) => Number(u.$extras.pivot_role_id) === Roles.SCHOOL_ADMIN
      )
      const primaryAdmin = primaryAdminUser
        ? { name: primaryAdminUser.fullName, email: primaryAdminUser.email }
        : null

      const sub = school.subscription
      const subscription = sub
        ? {
            id: sub.id,
            planId: sub.planId,
            planName: sub.plan?.name ?? null,
            planCode: sub.plan?.code ?? null,
            endDate: sub.endDate?.toISODate() ?? null,
            status: sub.status,
          }
        : null

      return {
        id: school.id,
        name: school.name,
        code: school.code,
        city: school.city,
        province: school.province,
        isSuspended: school.isSuspended,
        createdAt: school.createdAt.toISO()!,
        studentsCount,
        status,
        primaryAdmin,
        subscription,
      }
    })
  }
}

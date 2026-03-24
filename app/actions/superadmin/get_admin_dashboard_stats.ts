import School from '#models/school'
import SuperAdmin from '#models/super_admin'
import Student from '#models/student'
import SchoolSubscription from '#models/school_subscription'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'

export default class GetAdminDashboardStats {
  static async handle() {
    const now = DateTime.now()
    const startOfMonth = now.startOf('month')
    const thirtyDaysFromNow = now.plus({ days: 30 })

    const [
      schoolsCount,
      schoolsThisMonth,
      superAdminsCount,
      totalStudents,
      activeSubscriptionsCount,
      expiringSoonCount,
    ] = await Promise.all([
      School.query().count('* as total'),
      School.query().where('createdAt', '>=', startOfMonth.toSQL()!).count('* as total'),
      SuperAdmin.query().whereNull('revokedAt').count('* as total'),
      Student.query().count('* as total'),
      SchoolSubscription.query()
        .where('status', 'active')
        .where('endDate', '>', now.toSQL()!)
        .count('* as total'),
      SchoolSubscription.query()
        .where('status', 'active')
        .where('endDate', '>', now.toSQL()!)
        .where('endDate', '<=', thirtyDaysFromNow.toSQL()!)
        .count('* as total'),
    ])

    // Recent schools (last 10) with student count and active subscription info
    const recentSchoolsRows = await db
      .from('schools')
      .leftJoin('school_subscriptions', (join) => {
        join
          .on('schools.id', '=', 'school_subscriptions.school_id')
          .andOnVal('school_subscriptions.status', '=', 'active')
      })
      .leftJoin('subscription_plans', 'school_subscriptions.plan_id', 'subscription_plans.id')
      .leftJoin('students', 'schools.id', 'students.school_id')
      .select(
        'schools.id',
        'schools.name',
        'schools.is_suspended',
        'schools.created_at as joined_at',
        'subscription_plans.name as plan_name',
        'subscription_plans.code as plan_code',
        'school_subscriptions.end_date'
      )
      .countDistinct('students.id as students_count')
      .groupBy(
        'schools.id',
        'schools.name',
        'schools.is_suspended',
        'schools.created_at',
        'subscription_plans.name',
        'subscription_plans.code',
        'school_subscriptions.end_date'
      )
      .orderBy('schools.created_at', 'desc')
      .limit(10)

    const recentSchools = recentSchoolsRows.map((row) => {
      let status: 'active' | 'expiring' | 'expired' | 'suspended'
      if (row.is_suspended) {
        status = 'suspended'
      } else if (!row.end_date) {
        status = 'expired'
      } else {
        const endDate = DateTime.fromJSDate(row.end_date)
        if (endDate < now) {
          status = 'expired'
        } else if (endDate <= thirtyDaysFromNow) {
          status = 'expiring'
        } else {
          status = 'active'
        }
      }
      const planName = (row.plan_name as string | null) ?? null
      const planCode = (row.plan_code as string | null) ?? null
      return {
        id: row.id as string,
        name: row.name as string,
        code: null as string | null,
        city: null as string | null,
        province: null as string | null,
        isSuspended: Boolean(row.is_suspended),
        createdAt: (row.joined_at as string),
        studentsCount: Number(row.students_count),
        status,
        primaryAdmin: null,
        subscription: planName
          ? {
              id: '',
              planId: null,
              planName,
              planCode,
              endDate: row.end_date ? DateTime.fromJSDate(row.end_date).toISODate() : null,
              status: status === 'suspended' ? 'active' : status,
            }
          : null,
      }
    })

    // Plan distribution: count active subscriptions grouped by plan code
    const planDistributionRows = await db
      .from('school_subscriptions')
      .join('subscription_plans', 'school_subscriptions.plan_id', 'subscription_plans.id')
      .where('school_subscriptions.status', 'active')
      .select('subscription_plans.code')
      .count('* as total')
      .groupBy('subscription_plans.code')

    const planDistribution: { trial: number; basic: number; pro: number } = {
      trial: 0,
      basic: 0,
      pro: 0,
    }
    for (const row of planDistributionRows) {
      const code = row.code as string
      if (code in planDistribution) {
        planDistribution[code as keyof typeof planDistribution] = Number(row.total)
      }
    }

    // Schools with subscriptions expiring within 30 days
    const expiringSoonRows = await db
      .from('schools')
      .join('school_subscriptions', (join) => {
        join
          .on('schools.id', '=', 'school_subscriptions.school_id')
          .andOnVal('school_subscriptions.status', '=', 'active')
      })
      .where('school_subscriptions.end_date', '>', now.toSQL()!)
      .where('school_subscriptions.end_date', '<=', thirtyDaysFromNow.toSQL()!)
      .select('schools.name', 'school_subscriptions.end_date as expires_at')
      .orderBy('school_subscriptions.end_date', 'asc')

    const expiringSoon = expiringSoonRows.map((row) => ({
      name: row.name as string,
      expiresAt: DateTime.fromJSDate(row.expires_at as Date).toISO()!,
    }))

    return {
      stats: {
        schoolsCount: Number(schoolsCount[0].$extras.total),
        schoolsThisMonth: Number(schoolsThisMonth[0].$extras.total),
        superAdminsCount: Number(superAdminsCount[0].$extras.total),
        totalStudents: Number(totalStudents[0].$extras.total),
        activeSubscriptionsCount: Number(activeSubscriptionsCount[0].$extras.total),
        expiringSoonCount: Number(expiringSoonCount[0].$extras.total),
        recentSchools,
        planDistribution,
        expiringSoon,
      },
    }
  }
}

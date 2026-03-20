import SchoolSubscription from '#models/school_subscription'
import SubscriptionPlan from '#models/subscription_plan'
import { Exception } from '@adonisjs/core/exceptions'
import db from '@adonisjs/lucid/services/db'
import type { TransactionClientContract } from '@adonisjs/lucid/types/database'
import { DateTime } from 'luxon'

export default class SubscriptionLimitService {
  static async assertCanAddStudents(schoolId: string, count = 1, trx?: TransactionClientContract) {
    const maxStudents = await this.#getEffectiveLimit(schoolId, 'maxStudents', trx)
    if (maxStudents === null || maxStudents < 0) return

    const current = await this.#getCount('students', schoolId, trx)
    if (current + count > maxStudents) {
      throw new Exception(
        `Student limit reached for your plan (${maxStudents}). Upgrade your subscription to add more students.`,
        {
          status: 403,
          code: 'E_SUBSCRIPTION_STUDENT_LIMIT_REACHED',
        }
      )
    }
  }

  static async assertCanAddStaff(schoolId: string, count = 1, trx?: TransactionClientContract) {
    const maxStaff = await this.#getEffectiveLimit(schoolId, 'maxStaff', trx)
    if (maxStaff === null || maxStaff < 0) return

    const current = await this.#getCount('staff_members', schoolId, trx)
    if (current + count > maxStaff) {
      throw new Exception(
        `Staff limit reached for your plan (${maxStaff}). Upgrade your subscription to add more staff members.`,
        {
          status: 403,
          code: 'E_SUBSCRIPTION_STAFF_LIMIT_REACHED',
        }
      )
    }
  }

  static async #getEffectiveLimit(
    schoolId: string,
    key: 'maxStudents' | 'maxStaff',
    trx?: TransactionClientContract
  ): Promise<number | null> {
    const query = (trx ? SchoolSubscription.query({ client: trx }) : SchoolSubscription.query())
      .where('schoolId', schoolId)
      .where('status', 'active')
      .preload('plan')
      .orderBy('createdAt', 'desc')

    const subscription = await query.first()
    if (!subscription) {
      return this.#getFreePlanLimit(key, trx)
    }

    if (subscription.endDate && subscription.endDate < DateTime.now()) {
      return this.#getFreePlanLimit(key, trx)
    }

    const overrideLimit = subscription[key]
    if (overrideLimit !== null && overrideLimit !== undefined) return Number(overrideLimit)

    const planLimit = subscription.plan?.[key]
    if (planLimit === undefined || planLimit === null) {
      return this.#getFreePlanLimit(key, trx)
    }
    return Number(planLimit)
  }

  static async #getFreePlanLimit(
    key: 'maxStudents' | 'maxStaff',
    trx?: TransactionClientContract
  ): Promise<number | null> {
    const query = (trx ? SubscriptionPlan.query({ client: trx }) : SubscriptionPlan.query())
      .where('code', 'free')
      .where('isActive', true)

    const freePlan = await query.first()
    if (!freePlan) return null
    return Number(freePlan[key])
  }

  static async #getCount(
    table: 'students' | 'staff_members',
    schoolId: string,
    trx?: TransactionClientContract
  ): Promise<number> {
    const query = (trx ?? db).from(table).where('school_id', schoolId).count('* as total')
    const result = await query
    return Number(result[0]?.total ?? 0)
  }
}

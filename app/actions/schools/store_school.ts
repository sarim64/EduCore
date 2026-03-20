import School from '#models/school'
import User from '#models/user'
import SubscriptionPlan from '#models/subscription_plan'
import SchoolSubscription from '#models/school_subscription'
import { schoolValidator } from '#validators/school'
import { Infer } from '@vinejs/vine/types'
import db from '@adonisjs/lucid/services/db'
import Roles from '#enums/roles'
import { DateTime } from 'luxon'
import type { TransactionClientContract } from '@adonisjs/lucid/types/database'

type Params = {
  user: User
  data: Infer<typeof schoolValidator>
}

export default class StoreSchool {
  static async handle({ user, data }: Params) {
    return db.transaction(async (trx) => {
      const school = await School.create(data, { client: trx })
      const freePlan = await SubscriptionPlan.query({ client: trx }).where('code', 'free').first()

      if (!freePlan) {
        throw new Error('Free subscription plan is not configured')
      }

      await this.#assignAdmin(school, user, trx)
      await SchoolSubscription.create(
        {
          schoolId: school.id,
          planId: freePlan.id,
          status: 'active',
          startDate: DateTime.now(),
          endDate: null,
          maxStudents: null,
          maxStaff: null,
          createdBy: user.id,
        },
        { client: trx }
      )

      return school
    })
  }

  static async #assignAdmin(school: School, user: User, trx: TransactionClientContract) {
    return school.related('users').attach(
      {
        [user.id]: {
          role_id: Roles.SCHOOL_ADMIN,
        },
      },
      trx
    )
  }
}

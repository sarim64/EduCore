import Staff from '#models/staff_member'
import User from '#models/user'
import db from '@adonisjs/lucid/services/db'

type Params = {
  staff: Staff
  schoolId: string
}

export default class UnlinkStaffUser {
  static async handle({ staff, schoolId }: Params) {
    if (!staff.userId) {
      return
    }

    return db.transaction(async (trx) => {
      const user = await User.find(staff.userId, { client: trx })

      if (user) {
        // Detach user from school
        user.useTransaction(trx)
        await user.related('schools').detach([schoolId])
      }

      // Remove user link from staff
      staff.useTransaction(trx)
      staff.userId = null
      await staff.save()
    })
  }
}

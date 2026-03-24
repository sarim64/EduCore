import AcademicYear from '#models/academic_year'
import { createAcademicYearValidator } from '#validators/academic_year'
import { Infer } from '@vinejs/vine/types'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'

type Params = {
  schoolId: string
  data: Infer<typeof createAcademicYearValidator>
}

export default class StoreAcademicYear {
  static async handle({ schoolId, data }: Params) {
    return db.transaction(async (trx) => {
      // If this year is being set as current, unset other current years
      if (data.isCurrent) {
        await AcademicYear.query({ client: trx })
          .where('schoolId', schoolId)
          .where('isCurrent', true)
          .update({ isCurrent: false })
      }

      return AcademicYear.create(
        {
          schoolId,
          name: data.name,
          startDate: DateTime.fromJSDate(data.startDate),
          endDate: DateTime.fromJSDate(data.endDate),
          isCurrent: data.isCurrent ?? false,
        },
        { client: trx }
      )
    })
  }
}

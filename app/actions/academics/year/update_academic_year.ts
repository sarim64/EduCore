import AcademicYear from '#models/academic_year'
import { updateAcademicYearValidator } from '#validators/academic_year'
import { Infer } from '@vinejs/vine/types'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'

type Params = {
  academicYearId: string
  schoolId: string
  data: Infer<typeof updateAcademicYearValidator>
}

export default class UpdateAcademicYear {
  static async handle({ academicYearId, schoolId, data }: Params) {
    return db.transaction(async (trx) => {
      const academicYear = await AcademicYear.query({ client: trx })
        .where('id', academicYearId)
        .where('schoolId', schoolId)
        .firstOrFail()

      // If setting as current, unset others
      if (data.isCurrent && !academicYear.isCurrent) {
        await AcademicYear.query({ client: trx })
          .where('schoolId', schoolId)
          .where('isCurrent', true)
          .update({ isCurrent: false })
      }

      if (data.name) academicYear.name = data.name
      if (data.startDate) academicYear.startDate = DateTime.fromJSDate(data.startDate)
      if (data.endDate) academicYear.endDate = DateTime.fromJSDate(data.endDate)
      if (data.isCurrent !== undefined) academicYear.isCurrent = data.isCurrent

      await academicYear.save()
      return academicYear
    })
  }
}

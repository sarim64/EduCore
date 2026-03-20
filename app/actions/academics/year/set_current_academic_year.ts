import AcademicYear from '#models/academic_year'
import db from '@adonisjs/lucid/services/db'

type Params = {
  academicYearId: string
  schoolId: string
}

export default class SetCurrentAcademicYear {
  static async handle({ academicYearId, schoolId }: Params) {
    await db.transaction(async (trx) => {
      // Unset all current
      await AcademicYear.query({ client: trx })
        .where('schoolId', schoolId)
        .where('isCurrent', true)
        .update({ isCurrent: false })

      // Set this one as current
      await AcademicYear.query({ client: trx })
        .where('id', academicYearId)
        .where('schoolId', schoolId)
        .update({ isCurrent: true })
    })
  }
}

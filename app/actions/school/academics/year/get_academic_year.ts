import AcademicYear from '#models/academic_year'

type Params = {
  academicYearId: string
  schoolId: string
}

export default class GetAcademicYear {
  static async handle({ academicYearId, schoolId }: Params) {
    return AcademicYear.query()
      .where('id', academicYearId)
      .where('schoolId', schoolId)
      .firstOrFail()
  }
}

import AcademicYear from '#models/academic_year'

type Params = {
  schoolId: string
}

export default class ListAcademicYears {
  static async handle({ schoolId }: Params) {
    return AcademicYear.query().where('schoolId', schoolId).orderBy('startDate', 'desc')
  }
}

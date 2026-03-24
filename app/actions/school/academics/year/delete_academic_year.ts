import AcademicYear from '#models/academic_year'

type Params = {
  academicYearId: string
  schoolId: string
}

export default class DeleteAcademicYear {
  static async handle({ academicYearId, schoolId }: Params) {
    const academicYear = await AcademicYear.query()
      .where('id', academicYearId)
      .where('schoolId', schoolId)
      .firstOrFail()

    // TODO: When M2 is implemented, check for enrollments
    // const enrollmentCount = await db
    //   .from('enrollments')
    //   .where('academic_year_id', academicYearId)
    //   .count('* as total')
    // if (enrollmentCount[0].total > 0) {
    //   throw new Exception('Cannot delete academic year with existing enrollments', {
    //     status: 422,
    //     code: 'E_ACADEMIC_YEAR_HAS_ENROLLMENTS',
    //   })
    // }

    await academicYear.delete()
    return academicYear
  }
}

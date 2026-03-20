import Section from '#models/section'

type Params = {
  sectionId: string
  schoolId: string
}

export default class DeleteSection {
  static async handle({ sectionId, schoolId }: Params) {
    const section = await Section.query()
      .where('id', sectionId)
      .where('schoolId', schoolId)
      .firstOrFail()

    // TODO: When M2 is implemented, check for enrolled students
    // const enrollmentCount = await db
    //   .from('enrollments')
    //   .where('section_id', sectionId)
    //   .count('* as total')
    // if (enrollmentCount[0].total > 0) {
    //   throw new Exception('Cannot delete section with enrolled students', {
    //     status: 422,
    //     code: 'E_SECTION_HAS_ENROLLMENTS',
    //   })
    // }

    await section.delete()
    return section
  }
}

import SchoolClass from '#models/school_class'
import { Exception } from '@adonisjs/core/exceptions'

type Params = {
  classId: string
  schoolId: string
}

export default class DeleteClass {
  static async handle({ classId, schoolId }: Params) {
    const schoolClass = await SchoolClass.query()
      .where('id', classId)
      .where('schoolId', schoolId)
      .preload('sections')
      .firstOrFail()

    // Prevent deletion if sections exist
    if (schoolClass.sections.length > 0) {
      throw new Exception('Cannot delete class with existing sections', {
        status: 422,
        code: 'E_CLASS_HAS_SECTIONS',
      })
    }

    // TODO: When M2 is implemented, also check for enrollments
    // const enrollmentCount = await db
    //   .from('enrollments')
    //   .where('class_id', classId)
    //   .count('* as total')
    // if (enrollmentCount[0].total > 0) {
    //   throw new Exception('Cannot delete class with enrolled students', {
    //     status: 422,
    //     code: 'E_CLASS_HAS_ENROLLMENTS',
    //   })
    // }

    await schoolClass.delete()
    return schoolClass
  }
}

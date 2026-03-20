import Subject from '#models/subject'
import { Exception } from '@adonisjs/core/exceptions'
import db from '@adonisjs/lucid/services/db'

type Params = {
  subjectId: string
  schoolId: string
}

export default class DeleteSubject {
  static async handle({ subjectId, schoolId }: Params) {
    const subject = await Subject.query()
      .where('id', subjectId)
      .where('schoolId', schoolId)
      .firstOrFail()

    // Check if subject is assigned to any classes
    const assignmentCount = await db
      .from('class_subjects')
      .where('subject_id', subjectId)
      .count('* as total')
      .first()

    if (Number(assignmentCount?.total) > 0) {
      throw new Exception('Cannot delete subject assigned to classes. Remove assignments first.', {
        status: 422,
        code: 'E_SUBJECT_ASSIGNED_TO_CLASSES',
      })
    }

    // TODO: When grade/marks system is implemented, also check for grade entries
    // const gradeCount = await db
    //   .from('grades')
    //   .where('subject_id', subjectId)
    //   .count('* as total')
    // if (gradeCount[0].total > 0) {
    //   throw new Exception('Cannot delete subject with existing grades')
    // }

    await subject.delete()
    return subject
  }
}

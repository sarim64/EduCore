import TeacherAssignment from '#models/teacher_assignment'

type Params = {
  assignmentId: string
  schoolId: string
}

export default class GetTeacherAssignment {
  static async handle({ assignmentId, schoolId }: Params) {
    return TeacherAssignment.query()
      .where('id', assignmentId)
      .where('schoolId', schoolId)
      .preload('staffMember')
      .preload('academicYear')
      .preload('class')
      .preload('section')
      .preload('subject')
      .firstOrFail()
  }
}

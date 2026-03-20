import TeacherAssignment from '#models/teacher_assignment'

type Params = {
  schoolId: string
}

export default class ListTeacherAssignments {
  static async handle({ schoolId }: Params) {
    return TeacherAssignment.query()
      .where('schoolId', schoolId)
      .preload('staffMember')
      .preload('academicYear')
      .preload('class')
      .preload('section')
      .preload('subject')
      .orderBy('createdAt', 'desc')
  }
}

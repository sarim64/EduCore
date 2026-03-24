import TeacherAssignment from '#models/teacher_assignment'

type Params = {
  assignmentId: string
  schoolId: string
}

export default class DeleteTeacherAssignment {
  static async handle({ assignmentId, schoolId }: Params) {
    const assignment = await TeacherAssignment.query()
      .where('id', assignmentId)
      .where('schoolId', schoolId)
      .firstOrFail()

    await assignment.delete()
  }
}

import TeacherAssignment from '#models/teacher_assignment'
import { updateTeacherAssignmentValidator } from '#validators/teacher_assignment'
import { Infer } from '@vinejs/vine/types'

type Params = {
  assignmentId: string
  schoolId: string
  data: Infer<typeof updateTeacherAssignmentValidator>
}

export default class UpdateTeacherAssignment {
  static async handle({ assignmentId, schoolId, data }: Params) {
    const assignment = await TeacherAssignment.query()
      .where('id', assignmentId)
      .where('schoolId', schoolId)
      .firstOrFail()

    assignment.merge(data)
    await assignment.save()

    return assignment
  }
}

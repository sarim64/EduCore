import TeacherAssignment from '#models/teacher_assignment'
import { createTeacherAssignmentValidator } from '#validators/teacher_assignment'
import { Infer } from '@vinejs/vine/types'

type Params = {
  schoolId: string
  data: Infer<typeof createTeacherAssignmentValidator>
}

export default class StoreTeacherAssignment {
  static async handle({ schoolId, data }: Params) {
    return TeacherAssignment.create({
      schoolId,
      ...data,
      isClassTeacher: data.isClassTeacher ?? false,
    })
  }
}

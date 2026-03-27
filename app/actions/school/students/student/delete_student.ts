import Student from '#models/student'
import AuditService from '#services/audit_service'
import type { HttpContext } from '@adonisjs/core/http'

type Params = {
  id: string
  ctx: HttpContext
  userId: string
}

export default class DeleteStudent {
  static async handle({ id, ctx, userId }: Params) {
    const student = await Student.findOrFail(id)
    const schoolId = student.schoolId
    const oldValues = { firstName: student.firstName, lastName: student.lastName, studentId: student.studentId, status: student.status }

    await student.delete()

    await AuditService.logDelete('Student', id, oldValues, ctx, schoolId ?? undefined, userId)
  }
}

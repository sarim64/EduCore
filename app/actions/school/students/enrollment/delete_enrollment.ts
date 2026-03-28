import Enrollment from '#models/enrollment'
import AuditService from '#services/audit_service'
import type { HttpContext } from '@adonisjs/core/http'

type Params = {
  id: string
  ctx: HttpContext
  userId: string
}

export default class DeleteEnrollment {
  static async handle({ id, ctx, userId }: Params) {
    const enrollment = await Enrollment.findOrFail(id)
    const schoolId = enrollment.schoolId
    const oldValues = { studentId: enrollment.studentId, academicYearId: enrollment.academicYearId, classId: enrollment.classId, status: enrollment.status }

    await enrollment.delete()

    await AuditService.logDelete('Enrollment', id, oldValues, ctx, schoolId, userId)
  }
}

import Enrollment from '#models/enrollment'
import { updateEnrollmentValidator } from '#validators/enrollment'
import type { Infer } from '@vinejs/vine/types'
import AuditService from '#services/audit_service'
import type { HttpContext } from '@adonisjs/core/http'

type Params = {
  id: string
  data: Infer<typeof updateEnrollmentValidator>
  ctx: HttpContext
  userId: string
}

export default class UpdateEnrollment {
  static async handle({ id, data, ctx, userId }: Params) {
    const enrollment = await Enrollment.findOrFail(id)
    const schoolId = enrollment.schoolId
    const oldValues = { classId: enrollment.classId, sectionId: enrollment.sectionId, rollNumber: enrollment.rollNumber, status: enrollment.status }

    await enrollment.merge(data).save()

    await AuditService.logUpdate(
      'Enrollment',
      enrollment.id,
      oldValues,
      { classId: enrollment.classId, sectionId: enrollment.sectionId, rollNumber: enrollment.rollNumber, status: enrollment.status },
      ctx,
      schoolId ?? undefined,
      userId
    )

    return enrollment
  }
}

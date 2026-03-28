import Student from '#models/student'
import { updateStudentValidator } from '#validators/student'
import type { Infer } from '@vinejs/vine/types'
import { DateTime } from 'luxon'
import AuditService from '#services/audit_service'
import type { HttpContext } from '@adonisjs/core/http'

type Params = {
  id: string
  schoolId: string
  data: Infer<typeof updateStudentValidator>
  ctx: HttpContext
  userId: string
}

export default class UpdateStudent {
  static async handle({ id, schoolId, data, ctx, userId }: Params) {
    const student = await Student.findOrFail(id)
    const oldValues = { firstName: student.firstName, lastName: student.lastName, status: student.status, email: student.email, phone: student.phone }

    await student
      .merge({
        ...data,
        dateOfBirth: data.dateOfBirth ? DateTime.fromJSDate(data.dateOfBirth) : undefined,
        admissionDate: data.admissionDate ? DateTime.fromJSDate(data.admissionDate) : undefined,
      })
      .save()

    await AuditService.logUpdate(
      'Student',
      student.id,
      oldValues,
      { firstName: student.firstName, lastName: student.lastName, status: student.status, email: student.email, phone: student.phone },
      ctx,
      schoolId,
      userId
    )

    return student
  }
}

import StudentDiscount from '#models/student_discount'
import { bulkAssignStudentDiscountValidator } from '#validators/student_discount'
import { Infer } from '@vinejs/vine/types'
import { DateTime } from 'luxon'
import db from '@adonisjs/lucid/services/db'

type Params = {
  schoolId: string
  userId: string
  data: Infer<typeof bulkAssignStudentDiscountValidator>
}

export default class BulkAssignStudentDiscount {
  static async handle({ schoolId, userId, data }: Params) {
    return db.transaction(async (trx) => {
      const assignments: StudentDiscount[] = []

      for (const studentId of data.studentIds) {
        // Check if discount already assigned to this student for this year
        const existing = await StudentDiscount.query({ client: trx })
          .where('studentId', studentId)
          .where('feeDiscountId', data.feeDiscountId)
          .where('academicYearId', data.academicYearId)
          .first()

        if (!existing) {
          const assignment = await StudentDiscount.create(
            {
              schoolId,
              studentId,
              feeDiscountId: data.feeDiscountId,
              academicYearId: data.academicYearId,
              remarks: data.remarks,
              approvedBy: userId,
              approvedAt: DateTime.now(),
              isActive: true,
            },
            { client: trx }
          )
          assignments.push(assignment)
        }
      }

      return assignments
    })
  }
}

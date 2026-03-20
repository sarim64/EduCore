import DiscountType from '#enums/discount_type'
import StudentDiscount from '#models/student_discount'
import { createStudentDiscountValidator } from '#validators/student_discount'
import { Infer } from '@vinejs/vine/types'
import { DateTime } from 'luxon'

type Params = {
  schoolId: string
  userId: string
  data: Infer<typeof createStudentDiscountValidator>
}

export default class AssignStudentDiscount {
  static async handle({ schoolId, userId, data }: Params) {
    return StudentDiscount.create({
      ...data,
      overrideDiscountType: data.overrideDiscountType
        ? (data.overrideDiscountType as DiscountType)
        : null,
      schoolId,
      approvedBy: userId,
      approvedAt: DateTime.now(),
    })
  }
}

import FeeFrequency from '#enums/fee_frequency'
import FeeStructure from '#models/fee_structure'
import { createFeeStructureValidator } from '#validators/fee_structure'
import { Infer } from '@vinejs/vine/types'
import AuditService from '#services/audit_service'
import type { HttpContext } from '@adonisjs/core/http'

type Params = {
  schoolId: string
  data: Infer<typeof createFeeStructureValidator>
  ctx: HttpContext
  userId: string
}

export default class StoreFeeStructure {
  static async handle({ schoolId, data, ctx, userId }: Params) {
    const struct = await FeeStructure.create({
      ...data,
      frequency: data.frequency as FeeFrequency,
      schoolId,
    })

    await AuditService.logCreate(
      'FeeStructure',
      struct.id,
      { amount: struct.amount, frequency: struct.frequency, feeCategoryId: struct.feeCategoryId, classId: struct.classId },
      ctx,
      schoolId,
      userId
    )

    return struct
  }
}

import FeeFrequency from '#enums/fee_frequency'
import FeeStructure from '#models/fee_structure'
import { updateFeeStructureValidator } from '#validators/fee_structure'
import { Infer } from '@vinejs/vine/types'
import { Exception } from '@adonisjs/core/exceptions'
import AuditService from '#services/audit_service'
import type { HttpContext } from '@adonisjs/core/http'

type Params = {
  id: string
  schoolId: string
  data: Infer<typeof updateFeeStructureValidator>
  ctx: HttpContext
  userId: string
}

export default class UpdateFeeStructure {
  static async handle({ id, schoolId, data, ctx, userId }: Params) {
    const structure = await FeeStructure.query().where('id', id).where('schoolId', schoolId).first()

    if (!structure) {
      throw new Exception('Fee structure not found', { status: 404 })
    }

    const oldValues = { amount: structure.amount, frequency: structure.frequency, isActive: structure.isActive }

    structure.merge({
      ...data,
      frequency: data.frequency ? (data.frequency as FeeFrequency) : undefined,
    })
    await structure.save()

    await AuditService.logUpdate(
      'FeeStructure',
      structure.id,
      oldValues,
      { amount: structure.amount, frequency: structure.frequency, isActive: structure.isActive },
      ctx,
      schoolId,
      userId
    )

    return structure
  }
}

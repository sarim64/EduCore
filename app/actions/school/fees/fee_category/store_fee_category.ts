import FeeCategory from '#models/fee_category'
import { createFeeCategoryValidator } from '#validators/fee_category'
import { Infer } from '@vinejs/vine/types'
import AuditService from '#services/audit_service'
import type { HttpContext } from '@adonisjs/core/http'

type Params = {
  schoolId: string
  data: Infer<typeof createFeeCategoryValidator>
  ctx: HttpContext
  userId: string
}

export default class StoreFeeCategory {
  static async handle({ schoolId, data, ctx, userId }: Params) {
    const cat = await FeeCategory.create({
      ...data,
      schoolId,
    })

    await AuditService.logCreate(
      'FeeCategory',
      cat.id,
      { name: cat.name, isActive: cat.isActive },
      ctx,
      schoolId,
      userId
    )

    return cat
  }
}

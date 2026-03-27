import FeeCategory from '#models/fee_category'
import { updateFeeCategoryValidator } from '#validators/fee_category'
import { Infer } from '@vinejs/vine/types'
import { Exception } from '@adonisjs/core/exceptions'
import AuditService from '#services/audit_service'
import type { HttpContext } from '@adonisjs/core/http'

type Params = {
  id: string
  schoolId: string
  data: Infer<typeof updateFeeCategoryValidator>
  ctx: HttpContext
  userId: string
}

export default class UpdateFeeCategory {
  static async handle({ id, schoolId, data, ctx, userId }: Params) {
    const category = await FeeCategory.query().where('id', id).where('schoolId', schoolId).first()

    if (!category) {
      throw new Exception('Fee category not found', { status: 404 })
    }

    const oldValues = { name: category.name, isActive: category.isActive, isMandatory: category.isMandatory }

    category.merge(data)
    await category.save()

    await AuditService.logUpdate(
      'FeeCategory',
      category.id,
      oldValues,
      { name: category.name, isActive: category.isActive, isMandatory: category.isMandatory },
      ctx,
      schoolId,
      userId
    )

    return category
  }
}

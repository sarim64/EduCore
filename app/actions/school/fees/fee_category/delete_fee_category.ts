import FeeCategory from '#models/fee_category'
import FeeStructure from '#models/fee_structure'
import { Exception } from '@adonisjs/core/exceptions'
import AuditService from '#services/audit_service'
import type { HttpContext } from '@adonisjs/core/http'

type Params = {
  id: string
  schoolId: string
  ctx: HttpContext
  userId: string
}

export default class DeleteFeeCategory {
  static async handle({ id, schoolId, ctx, userId }: Params) {
    const category = await FeeCategory.query().where('id', id).where('schoolId', schoolId).first()

    if (!category) {
      throw new Exception('Fee category not found', { status: 404 })
    }

    // Check if category is used in fee structures
    const hasStructures = await FeeStructure.query().where('feeCategoryId', id).first()

    if (hasStructures) {
      throw new Exception('Cannot delete fee category that has associated fee structures', {
        status: 400,
      })
    }

    const oldValues = { name: category.name, isActive: category.isActive }

    await category.delete()

    await AuditService.logDelete('FeeCategory', id, oldValues, ctx, schoolId, userId)
  }
}

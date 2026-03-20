import { BaseModelDto } from '@adocasts.com/dto/base'
import FeeCategory from '#models/fee_category'

export default class FeeCategoryDto extends BaseModelDto {
  declare id: string
  declare schoolId: string
  declare name: string
  declare code: string | null
  declare description: string | null
  declare isMandatory: boolean
  declare isActive: boolean
  declare displayOrder: number
  declare createdAt: string
  declare updatedAt: string | null

  constructor(feeCategory?: FeeCategory) {
    super()

    if (!feeCategory) return
    this.id = feeCategory.id
    this.schoolId = feeCategory.schoolId
    this.name = feeCategory.name
    this.code = feeCategory.code
    this.description = feeCategory.description
    this.isMandatory = feeCategory.isMandatory
    this.isActive = feeCategory.isActive
    this.displayOrder = feeCategory.displayOrder
    this.createdAt = feeCategory.createdAt.toISO()!
    this.updatedAt = feeCategory.updatedAt?.toISO() ?? null
  }
}

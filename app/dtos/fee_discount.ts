import { BaseModelDto } from '@adocasts.com/dto/base'
import FeeDiscount from '#models/fee_discount'
import DiscountType from '#enums/discount_type'
import FeeCategoryDto from './fee_category.js'

export default class FeeDiscountDto extends BaseModelDto {
  declare id: string
  declare schoolId: string
  declare feeCategoryId: string | null
  declare name: string
  declare code: string | null
  declare description: string | null
  declare discountType: DiscountType
  declare value: number
  declare criteria: string | null
  declare maxBeneficiaries: number | null
  declare validFrom: string | null
  declare validUntil: string | null
  declare isActive: boolean
  declare createdAt: string
  declare updatedAt: string | null
  declare feeCategory: FeeCategoryDto | null

  constructor(feeDiscount?: FeeDiscount) {
    super()

    if (!feeDiscount) return
    this.id = feeDiscount.id
    this.schoolId = feeDiscount.schoolId
    this.feeCategoryId = feeDiscount.feeCategoryId
    this.name = feeDiscount.name
    this.code = feeDiscount.code
    this.description = feeDiscount.description
    this.discountType = feeDiscount.discountType
    this.value = Number(feeDiscount.value)
    this.criteria = feeDiscount.criteria
    this.maxBeneficiaries = feeDiscount.maxBeneficiaries
    this.validFrom = feeDiscount.validFrom?.toISODate() ?? null
    this.validUntil = feeDiscount.validUntil?.toISODate() ?? null
    this.isActive = feeDiscount.isActive
    this.createdAt = feeDiscount.createdAt.toISO()!
    this.updatedAt = feeDiscount.updatedAt?.toISO() ?? null
    this.feeCategory = feeDiscount.feeCategory ? new FeeCategoryDto(feeDiscount.feeCategory) : null
  }
}

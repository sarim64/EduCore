import { BaseModelDto } from '@adocasts.com/dto/base'
import FeeChallanItem from '#models/fee_challan_item'
import FeeCategoryDto from './fee_category.js'

export default class FeeChallanItemDto extends BaseModelDto {
  declare id: string
  declare feeChallanId: string
  declare feeCategoryId: string
  declare feeStructureId: string | null
  declare studentDiscountId: string | null
  declare amount: number
  declare discountAmount: number
  declare netAmount: number
  declare description: string | null
  declare createdAt: string
  declare updatedAt: string | null
  declare feeCategory: FeeCategoryDto | null

  constructor(feeChallanItem?: FeeChallanItem) {
    super()

    if (!feeChallanItem) return
    this.id = feeChallanItem.id
    this.feeChallanId = feeChallanItem.feeChallanId
    this.feeCategoryId = feeChallanItem.feeCategoryId
    this.feeStructureId = feeChallanItem.feeStructureId
    this.studentDiscountId = feeChallanItem.studentDiscountId
    this.amount = Number(feeChallanItem.amount)
    this.discountAmount = Number(feeChallanItem.discountAmount)
    this.netAmount = Number(feeChallanItem.netAmount)
    this.description = feeChallanItem.description
    this.createdAt = feeChallanItem.createdAt.toISO()!
    this.updatedAt = feeChallanItem.updatedAt?.toISO() ?? null
    this.feeCategory = feeChallanItem.feeCategory
      ? new FeeCategoryDto(feeChallanItem.feeCategory)
      : null
  }
}

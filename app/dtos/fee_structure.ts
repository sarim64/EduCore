import { BaseModelDto } from '@adocasts.com/dto/base'
import FeeStructure from '#models/fee_structure'
import FeeFrequency from '#enums/fee_frequency'
import AcademicYearDto from './academic_year.js'
import SchoolClassDto from './school_class.js'
import FeeCategoryDto from './fee_category.js'

export default class FeeStructureDto extends BaseModelDto {
  declare id: string
  declare schoolId: string
  declare academicYearId: string
  declare classId: string
  declare feeCategoryId: string
  declare amount: number
  declare frequency: FeeFrequency
  declare lateFeeAmount: number
  declare lateFeePercentage: number
  declare gracePeriodDays: number
  declare dueDayOfMonth: number
  declare isActive: boolean
  declare createdAt: string
  declare updatedAt: string | null
  declare academicYear: AcademicYearDto | null
  declare class: SchoolClassDto | null
  declare feeCategory: FeeCategoryDto | null

  constructor(feeStructure?: FeeStructure) {
    super()

    if (!feeStructure) return
    this.id = feeStructure.id
    this.schoolId = feeStructure.schoolId
    this.academicYearId = feeStructure.academicYearId
    this.classId = feeStructure.classId
    this.feeCategoryId = feeStructure.feeCategoryId
    this.amount = Number(feeStructure.amount)
    this.frequency = feeStructure.frequency
    this.lateFeeAmount = Number(feeStructure.lateFeeAmount)
    this.lateFeePercentage = Number(feeStructure.lateFeePercentage)
    this.gracePeriodDays = feeStructure.gracePeriodDays
    this.dueDayOfMonth = feeStructure.dueDayOfMonth
    this.isActive = feeStructure.isActive
    this.createdAt = feeStructure.createdAt.toISO()!
    this.updatedAt = feeStructure.updatedAt?.toISO() ?? null
    this.academicYear = feeStructure.academicYear
      ? new AcademicYearDto(feeStructure.academicYear)
      : null
    this.class = feeStructure.class ? new SchoolClassDto(feeStructure.class) : null
    this.feeCategory = feeStructure.feeCategory
      ? new FeeCategoryDto(feeStructure.feeCategory)
      : null
  }
}

import { BaseModelDto } from '@adocasts.com/dto/base'
import StudentDiscount from '#models/student_discount'
import DiscountType from '#enums/discount_type'
import StudentDto from './student.js'
import FeeDiscountDto from './fee_discount.js'
import AcademicYearDto from './academic_year.js'

export default class StudentDiscountDto extends BaseModelDto {
  declare id: string
  declare schoolId: string
  declare studentId: string
  declare feeDiscountId: string
  declare academicYearId: string
  declare overrideDiscountType: DiscountType | null
  declare overrideValue: number | null
  declare remarks: string | null
  declare approvedBy: string | null
  declare approvedAt: string | null
  declare isActive: boolean
  declare createdAt: string
  declare updatedAt: string | null
  declare student: StudentDto | null
  declare feeDiscount: FeeDiscountDto | null
  declare academicYear: AcademicYearDto | null
  declare effectiveDiscountType: DiscountType
  declare effectiveValue: number

  constructor(studentDiscount?: StudentDiscount) {
    super()

    if (!studentDiscount) return
    this.id = studentDiscount.id
    this.schoolId = studentDiscount.schoolId
    this.studentId = studentDiscount.studentId
    this.feeDiscountId = studentDiscount.feeDiscountId
    this.academicYearId = studentDiscount.academicYearId
    this.overrideDiscountType = studentDiscount.overrideDiscountType
    this.overrideValue = studentDiscount.overrideValue
      ? Number(studentDiscount.overrideValue)
      : null
    this.remarks = studentDiscount.remarks
    this.approvedBy = studentDiscount.approvedBy
    this.approvedAt = studentDiscount.approvedAt?.toISO() ?? null
    this.isActive = studentDiscount.isActive
    this.createdAt = studentDiscount.createdAt.toISO()!
    this.updatedAt = studentDiscount.updatedAt?.toISO() ?? null
    this.student = studentDiscount.student ? new StudentDto(studentDiscount.student) : null
    this.feeDiscount = studentDiscount.feeDiscount
      ? new FeeDiscountDto(studentDiscount.feeDiscount)
      : null
    this.academicYear = studentDiscount.academicYear
      ? new AcademicYearDto(studentDiscount.academicYear)
      : null
    this.effectiveDiscountType = studentDiscount.effectiveDiscountType
    this.effectiveValue = studentDiscount.effectiveValue
  }
}

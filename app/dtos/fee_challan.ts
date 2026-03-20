import { BaseModelDto } from '@adocasts.com/dto/base'
import FeeChallan from '#models/fee_challan'
import ChallanStatus from '#enums/challan_status'
import StudentDto from './student.js'
import AcademicYearDto from './academic_year.js'
import FeeChallanItemDto from './fee_challan_item.js'
import FeePaymentDto from './fee_payment.js'

export default class FeeChallanDto extends BaseModelDto {
  declare id: string
  declare schoolId: string
  declare studentId: string
  declare academicYearId: string
  declare enrollmentId: string | null
  declare challanNumber: string
  declare period: string
  declare issueDate: string
  declare dueDate: string
  declare totalAmount: number
  declare discountAmount: number
  declare lateFeeAmount: number
  declare netAmount: number
  declare paidAmount: number
  declare balanceAmount: number
  declare status: ChallanStatus
  declare lateFeeApplied: boolean
  declare lateFeeAppliedAt: string | null
  declare remarks: string | null
  declare generatedBy: string | null
  declare createdAt: string
  declare updatedAt: string | null
  declare student: StudentDto | null
  declare academicYear: AcademicYearDto | null
  declare items: FeeChallanItemDto[]
  declare payments: FeePaymentDto[]
  declare isPaid: boolean
  declare isOverdue: boolean
  declare hasPartialPayment: boolean

  constructor(feeChallan?: FeeChallan) {
    super()

    if (!feeChallan) return
    this.id = feeChallan.id
    this.schoolId = feeChallan.schoolId
    this.studentId = feeChallan.studentId
    this.academicYearId = feeChallan.academicYearId
    this.enrollmentId = feeChallan.enrollmentId
    this.challanNumber = feeChallan.challanNumber
    this.period = feeChallan.period
    this.issueDate = feeChallan.issueDate.toISODate()!
    this.dueDate = feeChallan.dueDate.toISODate()!
    this.totalAmount = Number(feeChallan.totalAmount)
    this.discountAmount = Number(feeChallan.discountAmount)
    this.lateFeeAmount = Number(feeChallan.lateFeeAmount)
    this.netAmount = Number(feeChallan.netAmount)
    this.paidAmount = Number(feeChallan.paidAmount)
    this.balanceAmount = Number(feeChallan.balanceAmount)
    this.status = feeChallan.status
    this.lateFeeApplied = feeChallan.lateFeeApplied
    this.lateFeeAppliedAt = feeChallan.lateFeeAppliedAt?.toISO() ?? null
    this.remarks = feeChallan.remarks
    this.generatedBy = feeChallan.generatedBy
    this.createdAt = feeChallan.createdAt.toISO()!
    this.updatedAt = feeChallan.updatedAt?.toISO() ?? null
    this.student = feeChallan.student ? new StudentDto(feeChallan.student) : null
    this.academicYear = feeChallan.academicYear
      ? new AcademicYearDto(feeChallan.academicYear)
      : null
    this.items = feeChallan.items?.map((item) => new FeeChallanItemDto(item)) ?? []
    this.payments = feeChallan.payments?.map((payment) => new FeePaymentDto(payment)) ?? []
    this.isPaid = feeChallan.isPaid
    this.isOverdue = feeChallan.isOverdue
    this.hasPartialPayment = feeChallan.hasPartialPayment
  }
}

import { BaseModelDto } from '@adocasts.com/dto/base'
import FeePayment from '#models/fee_payment'
import PaymentMethod from '#enums/payment_method'
import StudentDto from './student.js'

export default class FeePaymentDto extends BaseModelDto {
  declare id: string
  declare schoolId: string
  declare feeChallanId: string
  declare studentId: string
  declare receiptNumber: string
  declare amount: number
  declare paymentMethod: PaymentMethod
  declare paymentDate: string
  declare chequeNumber: string | null
  declare chequeDate: string | null
  declare bankName: string | null
  declare transactionReference: string | null
  declare remarks: string | null
  declare receivedBy: string | null
  declare isCancelled: boolean
  declare cancellationReason: string | null
  declare cancelledBy: string | null
  declare cancelledAt: string | null
  declare createdAt: string
  declare updatedAt: string | null
  declare student: StudentDto | null

  constructor(feePayment?: FeePayment) {
    super()

    if (!feePayment) return
    this.id = feePayment.id
    this.schoolId = feePayment.schoolId
    this.feeChallanId = feePayment.feeChallanId
    this.studentId = feePayment.studentId
    this.receiptNumber = feePayment.receiptNumber
    this.amount = Number(feePayment.amount)
    this.paymentMethod = feePayment.paymentMethod
    this.paymentDate = feePayment.paymentDate.toISODate()!
    this.chequeNumber = feePayment.chequeNumber
    this.chequeDate = feePayment.chequeDate?.toISODate() ?? null
    this.bankName = feePayment.bankName
    this.transactionReference = feePayment.transactionReference
    this.remarks = feePayment.remarks
    this.receivedBy = feePayment.receivedBy
    this.isCancelled = feePayment.isCancelled
    this.cancellationReason = feePayment.cancellationReason
    this.cancelledBy = feePayment.cancelledBy
    this.cancelledAt = feePayment.cancelledAt?.toISO() ?? null
    this.createdAt = feePayment.createdAt.toISO()!
    this.updatedAt = feePayment.updatedAt?.toISO() ?? null
    this.student = feePayment.student ? new StudentDto(feePayment.student) : null
  }
}

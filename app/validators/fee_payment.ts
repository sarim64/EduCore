import vine from '@vinejs/vine'

export const recordPaymentValidator = vine.compile(
  vine.object({
    feeChallanId: vine.string().uuid(),
    amount: vine.number().positive(),
    paymentMethod: vine.enum(['cash', 'bank_transfer', 'cheque', 'online', 'card']),
    paymentDate: vine.date(),
    bankAccountId: vine.string().uuid().optional(),
    chequeNumber: vine.string().trim().maxLength(50).optional(),
    chequeDate: vine.date().optional(),
    bankName: vine.string().trim().maxLength(100).optional(),
    transactionReference: vine.string().trim().maxLength(100).optional(),
    remarks: vine.string().trim().maxLength(500).optional(),
  })
)

export const cancelPaymentValidator = vine.compile(
  vine.object({
    reason: vine.string().trim().minLength(1).maxLength(500),
  })
)

export const bulkRecordPaymentValidator = vine.compile(
  vine.object({
    payments: vine
      .array(
        vine.object({
          feeChallanId: vine.string().uuid(),
          amount: vine.number().positive(),
          paymentMethod: vine.enum(['cash', 'bank_transfer', 'cheque', 'online', 'card']),
          paymentDate: vine.date(),
          bankAccountId: vine.string().uuid().optional(),
          chequeNumber: vine.string().trim().maxLength(50).optional(),
          chequeDate: vine.date().optional(),
          bankName: vine.string().trim().maxLength(100).optional(),
          transactionReference: vine.string().trim().maxLength(100).optional(),
          remarks: vine.string().trim().maxLength(500).optional(),
        })
      )
      .minLength(1),
  })
)

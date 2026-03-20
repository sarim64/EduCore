import factory from '@adonisjs/lucid/factories'
import FeePayment from '#models/fee_payment'
import PaymentMethod from '#enums/payment_method'
import { DateTime } from 'luxon'
import { SchoolFactory } from './school_factory.js'
import { FeeChallanFactory } from './fee_challan_factory.js'
import { StudentFactory } from './student_factory.js'

export const FeePaymentFactory = factory
  .define(FeePayment, async ({ faker }) => {
    const now = DateTime.now()
    const paymentMethod = faker.helpers.arrayElement(Object.values(PaymentMethod))

    return {
      receiptNumber: `RCP-${now.year}${String(now.month).padStart(2, '0')}-${faker.string.alphanumeric(4).toUpperCase()}`,
      amount: faker.number.float({ min: 1000, max: 20000, fractionDigits: 2 }),
      paymentMethod,
      paymentDate: DateTime.now(),
      chequeNumber: paymentMethod === PaymentMethod.CHEQUE ? faker.string.numeric(6) : null,
      chequeDate: paymentMethod === PaymentMethod.CHEQUE ? DateTime.now().plus({ days: 7 }) : null,
      bankName: [PaymentMethod.CHEQUE, PaymentMethod.BANK_TRANSFER].includes(paymentMethod)
        ? faker.company.name()
        : null,
      transactionReference: [PaymentMethod.ONLINE, PaymentMethod.CARD].includes(paymentMethod)
        ? faker.string.alphanumeric(12).toUpperCase()
        : null,
      remarks: faker.helpers.maybe(() => faker.lorem.sentence()),
      isCancelled: false,
    }
  })
  .relation('school', () => SchoolFactory)
  .relation('feeChallan', () => FeeChallanFactory)
  .relation('student', () => StudentFactory)
  .build()

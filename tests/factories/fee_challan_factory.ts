import factory from '@adonisjs/lucid/factories'
import FeeChallan from '#models/fee_challan'
import ChallanStatus from '#enums/challan_status'
import { DateTime } from 'luxon'
import { SchoolFactory } from './school_factory.js'
import { StudentFactory } from './student_factory.js'
import { AcademicYearFactory } from './academic_year_factory.js'

export const FeeChallanFactory = factory
  .define(FeeChallan, async ({ faker }) => {
    const now = DateTime.now()
    const totalAmount = faker.number.float({ min: 5000, max: 50000, fractionDigits: 2 })
    const discountAmount = faker.number.float({
      min: 0,
      max: totalAmount * 0.2,
      fractionDigits: 2,
    })
    const netAmount = totalAmount - discountAmount
    const paidAmount =
      faker.helpers.maybe(() => faker.number.float({ min: 0, max: netAmount, fractionDigits: 2 }), {
        probability: 0.5,
      }) ?? 0

    return {
      challanNumber: `FEE-${now.year}${String(now.month).padStart(2, '0')}-${faker.string.alphanumeric(4).toUpperCase()}`,
      period: `${now.year}-${String(now.month).padStart(2, '0')}`,
      issueDate: DateTime.now(),
      dueDate: DateTime.now().plus({ days: 15 }),
      totalAmount,
      discountAmount,
      lateFeeAmount: 0,
      netAmount,
      paidAmount,
      balanceAmount: netAmount - paidAmount,
      status:
        paidAmount === 0
          ? ChallanStatus.PENDING
          : paidAmount >= netAmount
            ? ChallanStatus.PAID
            : ChallanStatus.PARTIAL,
      lateFeeApplied: false,
    }
  })
  .relation('school', () => SchoolFactory)
  .relation('student', () => StudentFactory)
  .relation('academicYear', () => AcademicYearFactory)
  .build()

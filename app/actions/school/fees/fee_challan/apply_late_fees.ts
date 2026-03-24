import FeeChallan from '#models/fee_challan'
import FeeStructure from '#models/fee_structure'
import ChallanStatus from '#enums/challan_status'
import { DateTime } from 'luxon'
import db from '@adonisjs/lucid/services/db'

type Params = {
  schoolId: string
  challanIds?: string[]
  asOfDate?: DateTime
}

export default class ApplyLateFees {
  static async handle({ schoolId, challanIds, asOfDate }: Params) {
    const referenceDate = asOfDate ?? DateTime.now()

    return db.transaction(async (trx) => {
      // Get overdue challans that haven't had late fees applied
      const query = FeeChallan.query({ client: trx })
        .where('schoolId', schoolId)
        .where('lateFeeApplied', false)
        .where('dueDate', '<', referenceDate.toSQL()!)
        .whereIn('status', [ChallanStatus.PENDING, ChallanStatus.PARTIAL])
        .preload('enrollment')

      if (challanIds && challanIds.length > 0) {
        query.whereIn('id', challanIds)
      }

      const challans = await query

      let updatedCount = 0

      for (const challan of challans) {
        // Get fee structures for this class to calculate late fees
        const feeStructures = await FeeStructure.query({ client: trx })
          .where('academicYearId', challan.academicYearId)
          .where('classId', challan.enrollment.classId)
          .where('isActive', true)

        // Calculate days overdue
        const daysOverdue = Math.floor(referenceDate.diff(challan.dueDate, 'days').days)

        // Calculate total late fee
        let totalLateFee = 0

        for (const structure of feeStructures) {
          // Check if grace period has passed
          if (daysOverdue <= structure.gracePeriodDays) {
            continue
          }

          // Apply late fee (either fixed or percentage, whichever is greater)
          const percentageFee =
            (Number(structure.amount) * Number(structure.lateFeePercentage)) / 100
          const fixedFee = Number(structure.lateFeeAmount)
          totalLateFee += Math.max(percentageFee, fixedFee)
        }

        if (totalLateFee > 0) {
          challan.lateFeeAmount = totalLateFee
          challan.netAmount = challan.totalAmount - challan.discountAmount + totalLateFee
          challan.balanceAmount = challan.netAmount - challan.paidAmount
          challan.lateFeeApplied = true
          challan.lateFeeAppliedAt = DateTime.now()
          challan.status = ChallanStatus.OVERDUE

          await challan.save()
          updatedCount++
        }
      }

      return {
        processed: challans.length,
        updated: updatedCount,
      }
    })
  }
}

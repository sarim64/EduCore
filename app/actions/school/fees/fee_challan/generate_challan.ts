import FeeChallan from '#models/fee_challan'
import FeeChallanItem from '#models/fee_challan_item'
import FeeStructure from '#models/fee_structure'
import StudentDiscount from '#models/student_discount'
import Enrollment from '#models/enrollment'
import ChallanStatus from '#enums/challan_status'
import DiscountType from '#enums/discount_type'
import { generateChallanValidator } from '#validators/fee_challan'
import { Infer } from '@vinejs/vine/types'
import { DateTime } from 'luxon'
import db from '@adonisjs/lucid/services/db'
import AuditService from '#services/audit_service'
import type { HttpContext } from '@adonisjs/core/http'

type Params = {
  schoolId: string
  userId: string
  data: Infer<typeof generateChallanValidator>
  ctx: HttpContext
}

export default class GenerateChallan {
  static async handle({ schoolId, userId, data, ctx }: Params) {
    const challan = await db.transaction(async (trx) => {
      // Get student's enrollment for the academic year
      const enrollment = await Enrollment.query({ client: trx })
        .where('studentId', data.studentId)
        .where('academicYearId', data.academicYearId)
        .where('status', 'active')
        .first()

      if (!enrollment) {
        throw new Error('Student is not enrolled for this academic year')
      }

      // Check if challan already exists for this period
      const existingChallan = await FeeChallan.query({ client: trx })
        .where('studentId', data.studentId)
        .where('academicYearId', data.academicYearId)
        .where('period', data.period)
        .first()

      if (existingChallan) {
        throw new Error(`Challan already exists for period ${data.period}`)
      }

      // Get fee structures for the student's class
      const feeStructures = await FeeStructure.query({ client: trx })
        .where('academicYearId', data.academicYearId)
        .where('classId', enrollment.classId)
        .where('isActive', true)
        .preload('feeCategory')

      if (feeStructures.length === 0) {
        throw new Error('No fee structure defined for this class')
      }

      // Get student's active discounts
      const studentDiscounts = await StudentDiscount.query({ client: trx })
        .where('studentId', data.studentId)
        .where('academicYearId', data.academicYearId)
        .where('isActive', true)
        .preload('feeDiscount')

      // Generate challan number
      const challanNumber = await this.#generateChallanNumber(schoolId, trx)

      // Calculate totals
      let totalAmount = 0
      let totalDiscount = 0
      const items: Array<{
        feeCategoryId: string
        feeStructureId: string
        amount: number
        discountAmount: number
        netAmount: number
        studentDiscountId: string | null
      }> = []

      for (const structure of feeStructures) {
        const amount = Number(structure.amount)
        let discountAmount = 0
        let studentDiscountId: string | null = null

        // Find applicable discount for this category
        const applicableDiscount = studentDiscounts.find(
          (sd) =>
            !sd.feeDiscount.feeCategoryId ||
            sd.feeDiscount.feeCategoryId === structure.feeCategoryId
        )

        if (applicableDiscount) {
          const discountType =
            applicableDiscount.overrideDiscountType ?? applicableDiscount.feeDiscount.discountType
          const discountValue =
            applicableDiscount.overrideValue ?? applicableDiscount.feeDiscount.value

          if (discountType === DiscountType.PERCENTAGE) {
            discountAmount = (amount * Number(discountValue)) / 100
          } else {
            discountAmount = Math.min(Number(discountValue), amount)
          }
          studentDiscountId = applicableDiscount.id
        }

        const netAmount = amount - discountAmount
        totalAmount += amount
        totalDiscount += discountAmount

        items.push({
          feeCategoryId: structure.feeCategoryId,
          feeStructureId: structure.id,
          amount,
          discountAmount,
          netAmount,
          studentDiscountId,
        })
      }

      const netAmount = totalAmount - totalDiscount

      // Create challan
      const newChallan = await FeeChallan.create(
        {
          schoolId,
          studentId: data.studentId,
          academicYearId: data.academicYearId,
          enrollmentId: enrollment.id,
          challanNumber,
          period: data.period,
          issueDate: DateTime.fromJSDate(data.issueDate),
          dueDate: DateTime.fromJSDate(data.dueDate),
          totalAmount,
          discountAmount: totalDiscount,
          lateFeeAmount: 0,
          netAmount,
          paidAmount: 0,
          balanceAmount: netAmount,
          status: ChallanStatus.PENDING,
          lateFeeApplied: false,
          remarks: data.remarks,
          generatedBy: userId,
        },
        { client: trx }
      )

      // Create challan items
      for (const item of items) {
        await FeeChallanItem.create(
          {
            feeChallanId: newChallan.id,
            ...item,
          },
          { client: trx }
        )
      }

      // Reload with relationships
      await newChallan.load('student')
      await newChallan.load('items', (q) => q.preload('feeCategory'))

      return newChallan
    })

    await AuditService.logCreate(
      'FeeChallan',
      challan.id,
      { challanNumber: challan.challanNumber, studentId: challan.studentId, period: challan.period, netAmount: challan.netAmount },
      ctx,
      schoolId,
      userId
    )

    return challan
  }

  static async #generateChallanNumber(
    schoolId: string,
    trx: ReturnType<typeof db.transaction> extends Promise<infer T> ? T : never
  ) {
    const now = DateTime.now()
    const prefix = `FEE-${now.year}${String(now.month).padStart(2, '0')}`

    // Get the last challan number for this month
    const lastChallan = await FeeChallan.query({ client: trx })
      .where('schoolId', schoolId)
      .where('challanNumber', 'like', `${prefix}%`)
      .orderBy('challanNumber', 'desc')
      .first()

    let sequence = 1
    if (lastChallan) {
      const lastSequence = Number.parseInt(lastChallan.challanNumber.split('-').pop() || '0', 10)
      sequence = lastSequence + 1
    }

    return `${prefix}-${String(sequence).padStart(5, '0')}`
  }
}

import FeeChallan from '#models/fee_challan'
import FeeChallanItem from '#models/fee_challan_item'
import FeeStructure from '#models/fee_structure'
import StudentDiscount from '#models/student_discount'
import Enrollment from '#models/enrollment'
import ChallanStatus from '#enums/challan_status'
import DiscountType from '#enums/discount_type'
import { bulkGenerateChallanValidator } from '#validators/fee_challan'
import { Infer } from '@vinejs/vine/types'
import { DateTime } from 'luxon'
import db from '@adonisjs/lucid/services/db'
import AuditService from '#services/audit_service'
import type { HttpContext } from '@adonisjs/core/http'

type Params = {
  schoolId: string
  userId: string
  data: Infer<typeof bulkGenerateChallanValidator>
  ctx: HttpContext
}

export default class BulkGenerateChallans {
  static async handle({ schoolId, userId, data, ctx }: Params) {
    const result = await db.transaction(async (trx) => {
      // Get all active enrollments for the academic year
      const enrollmentQuery = Enrollment.query({ client: trx })
        .where('academicYearId', data.academicYearId)
        .where('schoolId', schoolId)
        .where('status', 'active')
        .preload('student')

      if (data.classId) {
        enrollmentQuery.where('classId', data.classId)
      }

      if (data.sectionId) {
        enrollmentQuery.where('sectionId', data.sectionId)
      }

      const enrollments = await enrollmentQuery

      if (enrollments.length === 0) {
        throw new Error('No active enrollments found for the given criteria')
      }

      // Get fee structures grouped by class
      const feeStructures = await FeeStructure.query({ client: trx })
        .where('academicYearId', data.academicYearId)
        .where('schoolId', schoolId)
        .where('isActive', true)
        .if(data.classId, (q) => q.where('classId', data.classId!))
        .preload('feeCategory')

      if (feeStructures.length === 0) {
        throw new Error('No fee structures defined for the selected classes')
      }

      // Group fee structures by class
      const structuresByClass = feeStructures.reduce(
        (acc, fs) => {
          if (!acc[fs.classId]) {
            acc[fs.classId] = []
          }
          acc[fs.classId].push(fs)
          return acc
        },
        {} as Record<string, typeof feeStructures>
      )

      // Get all student discounts for the academic year
      const allDiscounts = await StudentDiscount.query({ client: trx })
        .where('academicYearId', data.academicYearId)
        .where('schoolId', schoolId)
        .where('isActive', true)
        .preload('feeDiscount')

      // Group discounts by student
      const discountsByStudent = allDiscounts.reduce(
        (acc, sd) => {
          if (!acc[sd.studentId]) {
            acc[sd.studentId] = []
          }
          acc[sd.studentId].push(sd)
          return acc
        },
        {} as Record<string, typeof allDiscounts>
      )

      // Get existing challans for this period to skip
      const existingChallans = await FeeChallan.query({ client: trx })
        .where('academicYearId', data.academicYearId)
        .where('period', data.period)
        .select('studentId')

      const existingStudentIds = new Set(existingChallans.map((c) => c.studentId))

      const challans: FeeChallan[] = []
      let challanSequence = await this.#getStartingSequence(schoolId, trx)

      for (const enrollment of enrollments) {
        // Skip if challan already exists for this student
        if (existingStudentIds.has(enrollment.studentId)) {
          continue
        }

        const classStructures = structuresByClass[enrollment.classId]
        if (!classStructures || classStructures.length === 0) {
          continue
        }

        const studentDiscounts = discountsByStudent[enrollment.studentId] || []

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

        for (const structure of classStructures) {
          const amount = Number(structure.amount)
          let discountAmount = 0
          let studentDiscountId: string | null = null

          // Find applicable discount
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
        const now = DateTime.now()
        const challanNumber = `FEE-${now.year}${String(now.month).padStart(2, '0')}-${String(challanSequence).padStart(5, '0')}`
        challanSequence++

        // Create challan
        const challan = await FeeChallan.create(
          {
            schoolId,
            studentId: enrollment.studentId,
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
            generatedBy: userId,
          },
          { client: trx }
        )

        // Create challan items
        for (const item of items) {
          await FeeChallanItem.create(
            {
              feeChallanId: challan.id,
              ...item,
            },
            { client: trx }
          )
        }

        challans.push(challan)
      }

      return {
        generated: challans.length,
        skipped: existingStudentIds.size,
        total: enrollments.length,
      }
    })

    await AuditService.log(
      {
        schoolId,
        userId,
        action: 'create',
        entityType: 'FeeChallan',
        description: `Bulk generated ${result.generated} challans`,
      },
      ctx
    )

    return result
  }

  static async #getStartingSequence(
    schoolId: string,
    trx: ReturnType<typeof db.transaction> extends Promise<infer T> ? T : never
  ) {
    const now = DateTime.now()
    const prefix = `FEE-${now.year}${String(now.month).padStart(2, '0')}`

    const lastChallan = await FeeChallan.query({ client: trx })
      .where('schoolId', schoolId)
      .where('challanNumber', 'like', `${prefix}%`)
      .orderBy('challanNumber', 'desc')
      .first()

    if (lastChallan) {
      const lastSequence = Number.parseInt(lastChallan.challanNumber.split('-').pop() || '0', 10)
      return lastSequence + 1
    }

    return 1
  }
}

import FeeFrequency from '#enums/fee_frequency'
import FeeStructure from '#models/fee_structure'
import { bulkCreateFeeStructureValidator } from '#validators/fee_structure'
import { Infer } from '@vinejs/vine/types'
import db from '@adonisjs/lucid/services/db'

type Params = {
  schoolId: string
  data: Infer<typeof bulkCreateFeeStructureValidator>
}

export default class BulkCreateFeeStructures {
  static async handle({ schoolId, data }: Params) {
    return db.transaction(async (trx) => {
      const structures: FeeStructure[] = []

      for (const classId of data.classIds) {
        for (const structure of data.structures) {
          // Check if structure already exists for this class/category/year
          const existing = await FeeStructure.query({ client: trx })
            .where('academicYearId', data.academicYearId)
            .where('classId', classId)
            .where('feeCategoryId', structure.feeCategoryId)
            .first()

          if (existing) {
            // Update existing structure
            existing.merge({
              amount: structure.amount,
              frequency: structure.frequency as FeeFrequency,
              lateFeeAmount: structure.lateFeeAmount ?? 0,
              lateFeePercentage: structure.lateFeePercentage ?? 0,
              gracePeriodDays: structure.gracePeriodDays ?? 0,
              dueDayOfMonth: structure.dueDayOfMonth ?? 10,
              isActive: true,
            })
            await existing.save()
            structures.push(existing)
          } else {
            // Create new structure
            const newStructure = await FeeStructure.create(
              {
                schoolId,
                academicYearId: data.academicYearId,
                classId,
                feeCategoryId: structure.feeCategoryId,
                amount: structure.amount,
                frequency: structure.frequency as FeeFrequency,
                lateFeeAmount: structure.lateFeeAmount ?? 0,
                lateFeePercentage: structure.lateFeePercentage ?? 0,
                gracePeriodDays: structure.gracePeriodDays ?? 0,
                dueDayOfMonth: structure.dueDayOfMonth ?? 10,
                isActive: true,
              },
              { client: trx }
            )
            structures.push(newStructure)
          }
        }
      }

      return structures
    })
  }
}

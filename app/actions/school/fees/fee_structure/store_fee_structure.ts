import FeeFrequency from '#enums/fee_frequency'
import FeeStructure from '#models/fee_structure'
import { createFeeStructureValidator } from '#validators/fee_structure'
import { Infer } from '@vinejs/vine/types'

type Params = {
  schoolId: string
  data: Infer<typeof createFeeStructureValidator>
}

export default class StoreFeeStructure {
  static async handle({ schoolId, data }: Params) {
    return FeeStructure.create({
      ...data,
      frequency: data.frequency as FeeFrequency,
      schoolId,
    })
  }
}

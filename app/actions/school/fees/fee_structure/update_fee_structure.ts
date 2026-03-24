import FeeFrequency from '#enums/fee_frequency'
import FeeStructure from '#models/fee_structure'
import { updateFeeStructureValidator } from '#validators/fee_structure'
import { Infer } from '@vinejs/vine/types'
import { Exception } from '@adonisjs/core/exceptions'

type Params = {
  id: string
  schoolId: string
  data: Infer<typeof updateFeeStructureValidator>
}

export default class UpdateFeeStructure {
  static async handle({ id, schoolId, data }: Params) {
    const structure = await FeeStructure.query().where('id', id).where('schoolId', schoolId).first()

    if (!structure) {
      throw new Exception('Fee structure not found', { status: 404 })
    }

    structure.merge({
      ...data,
      frequency: data.frequency ? (data.frequency as FeeFrequency) : undefined,
    })
    await structure.save()

    return structure
  }
}

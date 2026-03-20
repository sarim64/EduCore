import FeeStructure from '#models/fee_structure'
import FeeChallanItem from '#models/fee_challan_item'
import { Exception } from '@adonisjs/core/exceptions'

type Params = {
  id: string
  schoolId: string
}

export default class DeleteFeeStructure {
  static async handle({ id, schoolId }: Params) {
    const structure = await FeeStructure.query().where('id', id).where('schoolId', schoolId).first()

    if (!structure) {
      throw new Exception('Fee structure not found', { status: 404 })
    }

    // Check if structure is used in challans
    const hasChallans = await FeeChallanItem.query().where('feeStructureId', id).first()

    if (hasChallans) {
      throw new Exception('Cannot delete fee structure that has generated challans', {
        status: 400,
      })
    }

    await structure.delete()
  }
}

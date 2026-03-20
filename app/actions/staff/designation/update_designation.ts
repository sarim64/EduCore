import Designation from '#models/designation'
import { updateDesignationValidator } from '#validators/designation'
import { Infer } from '@vinejs/vine/types'

type Params = {
  designationId: string
  schoolId: string
  data: Infer<typeof updateDesignationValidator>
}

export default class UpdateDesignation {
  static async handle({ designationId, schoolId, data }: Params) {
    const designation = await Designation.query()
      .where('id', designationId)
      .where('schoolId', schoolId)
      .firstOrFail()

    designation.merge(data)
    await designation.save()

    return designation
  }
}

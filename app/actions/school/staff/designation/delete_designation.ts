import Designation from '#models/designation'

type Params = {
  designationId: string
  schoolId: string
}

export default class DeleteDesignation {
  static async handle({ designationId, schoolId }: Params) {
    const designation = await Designation.query()
      .where('id', designationId)
      .where('schoolId', schoolId)
      .firstOrFail()

    await designation.delete()

    return designation
  }
}

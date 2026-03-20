import Designation from '#models/designation'

type Params = {
  designationId: string
  schoolId: string
}

export default class GetDesignation {
  static async handle({ designationId, schoolId }: Params) {
    return Designation.query()
      .where('id', designationId)
      .where('schoolId', schoolId)
      .preload('department')
      .firstOrFail()
  }
}

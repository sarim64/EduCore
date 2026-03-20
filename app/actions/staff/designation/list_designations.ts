import Designation from '#models/designation'

type Params = {
  schoolId: string
}

export default class ListDesignations {
  static async handle({ schoolId }: Params) {
    return Designation.query()
      .where('schoolId', schoolId)
      .preload('department')
      .orderBy('name', 'asc')
  }
}

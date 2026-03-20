import FeeStructure from '#models/fee_structure'

type Params = {
  schoolId: string
  academicYearId?: string
  classId?: string
  includeInactive?: boolean
}

export default class ListFeeStructures {
  static async handle({ schoolId, academicYearId, classId, includeInactive = false }: Params) {
    const query = FeeStructure.query()
      .where('schoolId', schoolId)
      .preload('academicYear')
      .preload('class')
      .preload('feeCategory')
      .orderBy('classId')
      .orderBy('feeCategoryId')

    if (academicYearId) {
      query.where('academicYearId', academicYearId)
    }

    if (classId) {
      query.where('classId', classId)
    }

    if (!includeInactive) {
      query.where('isActive', true)
    }

    return query
  }
}

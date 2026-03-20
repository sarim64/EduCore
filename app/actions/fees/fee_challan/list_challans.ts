import FeeChallan from '#models/fee_challan'
import ChallanStatus from '#enums/challan_status'

type Params = {
  schoolId: string
  academicYearId?: string
  studentId?: string
  classId?: string
  status?: ChallanStatus
  page?: number
  limit?: number
}

export default class ListChallans {
  static async handle({
    schoolId,
    academicYearId,
    studentId,
    classId,
    status,
    page = 1,
    limit = 20,
  }: Params) {
    const query = FeeChallan.query()
      .where('schoolId', schoolId)
      .preload('student')
      .preload('academicYear')
      .preload('enrollment', (q) => q.preload('class').preload('section'))
      .orderBy('createdAt', 'desc')

    if (academicYearId) {
      query.where('academicYearId', academicYearId)
    }

    if (studentId) {
      query.where('studentId', studentId)
    }

    if (classId) {
      query.whereHas('enrollment', (eq) => eq.where('classId', classId))
    }

    if (status) {
      query.where('status', status)
    }

    return query.paginate(page, limit)
  }
}

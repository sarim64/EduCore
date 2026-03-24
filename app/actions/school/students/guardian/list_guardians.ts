import Guardian from '#models/guardian'

type Params = {
  schoolId: string
  studentId?: string
}

export default class ListGuardians {
  static async handle({ schoolId, studentId }: Params) {
    const query = Guardian.query().where('schoolId', schoolId).preload('students')

    if (studentId) {
      query.whereHas('students', (studentQuery) => {
        studentQuery.where('students.id', studentId)
      })
    }

    return query.orderBy('firstName', 'asc')
  }
}

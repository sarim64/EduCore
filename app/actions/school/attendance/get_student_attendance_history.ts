import Student from '#models/student'
import StudentAttendance from '#models/student_attendance'

type Params = {
  studentId: string
  schoolId: string
}

export default class GetStudentAttendanceHistory {
  static async handle({ studentId, schoolId }: Params) {
    const [student, attendances] = await Promise.all([
      Student.query().where('id', studentId).where('schoolId', schoolId).firstOrFail(),
      StudentAttendance.query()
        .where('schoolId', schoolId)
        .where('studentId', studentId)
        .orderBy('date', 'desc')
        .limit(100),
    ])

    return { student, attendances }
  }
}

import Student from '#models/student'

export default class DetachGuardianFromStudent {
  static async handle(studentId: string, guardianId: string, schoolId: string): Promise<void> {
    const student = await Student.query()
      .where('id', studentId)
      .where('schoolId', schoolId)
      .firstOrFail()

    await student.related('guardians').detach([guardianId])
  }
}

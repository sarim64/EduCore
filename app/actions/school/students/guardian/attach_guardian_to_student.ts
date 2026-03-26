import Student from '#models/student'
import Guardian from '#models/guardian'
import db from '@adonisjs/lucid/services/db'

type Params = {
  studentId: string
  guardianId: string
  schoolId: string
  isPrimary?: boolean
  isEmergencyContact?: boolean
  canPickup?: boolean
}

export default class AttachGuardianToStudent {
  static async handle({
    studentId,
    guardianId,
    schoolId,
    isPrimary = false,
    isEmergencyContact = false,
    canPickup = true,
  }: Params): Promise<void> {
    const [student] = await Promise.all([
      Student.query().where('id', studentId).where('schoolId', schoolId).firstOrFail(),
      Guardian.query().where('id', guardianId).where('schoolId', schoolId).firstOrFail(),
    ])

    const exists = await db
      .from('student_guardians')
      .where('student_id', studentId)
      .where('guardian_id', guardianId)
      .first()

    if (exists) {
      const e = new Error('Guardian is already linked to this student') as any
      e.code = 'E_DUPLICATE_GUARDIAN_LINK'
      throw e
    }

    await student.related('guardians').attach({
      [guardianId]: {
        is_primary: isPrimary,
        is_emergency_contact: isEmergencyContact,
        can_pickup: canPickup,
      },
    })
  }
}

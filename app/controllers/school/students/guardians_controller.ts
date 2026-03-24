import ListGuardians from '#actions/school/students/guardian/list_guardians'
import GetGuardian from '#actions/school/students/guardian/get_guardian'
import StoreGuardian from '#actions/school/students/guardian/store_guardian'
import UpdateGuardian from '#actions/school/students/guardian/update_guardian'
import DeleteGuardian from '#actions/school/students/guardian/delete_guardian'
import GuardianDto from '#dtos/guardian'
import {
  createGuardianValidator,
  updateGuardianValidator,
  attachGuardianValidator,
} from '#validators/guardian'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class GuardiansController {
  async index({ session, inertia }: HttpContext) {
    const schoolId = session.get('schoolId')

    const guardians = await ListGuardians.handle({ schoolId })

    return inertia.render('school/students/guardians/index', {
      guardians: guardians.map((g) => new GuardianDto(g)),
    })
  }

  async create({ inertia, request }: HttpContext) {
    const studentId = request.input('studentId')
    return inertia.render('school/students/guardians/create', { studentId: studentId ?? null })
  }

  async store({ request, response, session }: HttpContext) {
    const schoolId = session.get('schoolId')
    const data = await request.validateUsing(createGuardianValidator)
    const studentId = request.input('studentId')

    const guardian = await StoreGuardian.handle({ schoolId, data })

    if (studentId) {
      const { default: Student } = await import('#models/student')
      const student = await Student.query()
        .where('id', studentId)
        .where('schoolId', schoolId)
        .firstOrFail()

      const exists = await db
        .from('student_guardians')
        .where('student_id', student.id)
        .where('guardian_id', guardian.id)
        .first()

      if (!exists) {
        await student.related('guardians').attach({
          [guardian.id]: {
            is_primary: false,
            is_emergency_contact: false,
            can_pickup: true,
          },
        })
      }

      session.flash('success', 'Guardian created and attached to student')
      return response.redirect().toRoute('students.show', { id: studentId })
    }

    session.flash('success', 'Guardian created successfully')
    return response.redirect().toRoute('guardians.index')
  }

  async edit({ params, session, inertia }: HttpContext) {
    const schoolId = session.get('schoolId')

    const guardian = await GetGuardian.handle({
      guardianId: params.id,
      schoolId,
    })

    return inertia.render('school/students/guardians/edit', {
      guardian: new GuardianDto(guardian),
    })
  }

  async update({ params, request, response, session }: HttpContext) {
    const schoolId = session.get('schoolId')
    const data = await request.validateUsing(updateGuardianValidator)

    await UpdateGuardian.handle({ guardianId: params.id, schoolId, data })

    session.flash('success', 'Guardian updated successfully')
    return response.redirect().toRoute('guardians.index')
  }

  async destroy({ params, response, session }: HttpContext) {
    const schoolId = session.get('schoolId')
    await DeleteGuardian.handle({ guardianId: params.id, schoolId })

    session.flash('success', 'Guardian deleted successfully')
    return response.redirect().toRoute('guardians.index')
  }

  // Attach guardian to student
  async attachToStudent({ params, request, response, session }: HttpContext) {
    const schoolId = session.get('schoolId')
    const { studentId } = params
    const data = await request.validateUsing(attachGuardianValidator)

    // Verify student belongs to school
    const { default: Student } = await import('#models/student')
    const student = await Student.query()
      .where('id', studentId)
      .where('schoolId', schoolId)
      .firstOrFail()

    // Verify guardian belongs to school
    const { default: Guardian } = await import('#models/guardian')
    await Guardian.query().where('id', data.guardianId).where('schoolId', schoolId).firstOrFail()

    const exists = await db
      .from('student_guardians')
      .where('student_id', studentId)
      .where('guardian_id', data.guardianId)
      .first()

    if (exists) {
      session.flash('error', 'Guardian is already linked to this student')
      return response.redirect().back()
    }

    // Attach guardian to student
    await student.related('guardians').attach({
      [data.guardianId]: {
        is_primary: data.isPrimary ?? false,
        is_emergency_contact: data.isEmergencyContact ?? false,
        can_pickup: data.canPickup ?? true,
      },
    })

    session.flash('success', 'Guardian attached to student')
    return response.redirect().back()
  }

  // Detach guardian from student
  async detachFromStudent({ params, response, session }: HttpContext) {
    const schoolId = session.get('schoolId')
    const { studentId, guardianId } = params

    const { default: Student } = await import('#models/student')
    const student = await Student.query()
      .where('id', studentId)
      .where('schoolId', schoolId)
      .firstOrFail()

    await student.related('guardians').detach([guardianId])

    session.flash('success', 'Guardian removed from student')
    return response.redirect().back()
  }
}

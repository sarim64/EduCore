import ListGuardians from '#actions/school/students/guardian/list_guardians'
import GetGuardian from '#actions/school/students/guardian/get_guardian'
import StoreGuardian from '#actions/school/students/guardian/store_guardian'
import UpdateGuardian from '#actions/school/students/guardian/update_guardian'
import DeleteGuardian from '#actions/school/students/guardian/delete_guardian'
import AttachGuardianToStudent from '#actions/school/students/guardian/attach_guardian_to_student'
import DetachGuardianFromStudent from '#actions/school/students/guardian/detach_guardian_from_student'
import GuardianDto from '#dtos/guardian'
import {
  createGuardianValidator,
  updateGuardianValidator,
  attachGuardianValidator,
} from '#validators/guardian'
import type { HttpContext } from '@adonisjs/core/http'

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

  async store(ctx: HttpContext) {
    const { request, response, session, auth } = ctx
    const schoolId = session.get('schoolId')
    const data = await request.validateUsing(createGuardianValidator)
    const studentId = request.input('studentId')

    const guardian = await StoreGuardian.handle({ schoolId, data, ctx, userId: auth.user!.id })

    if (studentId) {
      await AttachGuardianToStudent.handle({
        studentId,
        guardianId: guardian.id,
        schoolId,
        isPrimary: false,
        isEmergencyContact: false,
        canPickup: true,
      })

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

  async update(ctx: HttpContext) {
    const { params, request, response, session, auth } = ctx
    const schoolId = session.get('schoolId')
    const data = await request.validateUsing(updateGuardianValidator)

    await UpdateGuardian.handle({ guardianId: params.id, schoolId, data, ctx, userId: auth.user!.id })

    session.flash('success', 'Guardian updated successfully')
    return response.redirect().toRoute('guardians.index')
  }

  async destroy(ctx: HttpContext) {
    const { params, response, session, auth } = ctx
    const schoolId = session.get('schoolId')
    await DeleteGuardian.handle({ guardianId: params.id, schoolId, ctx, userId: auth.user!.id })

    session.flash('success', 'Guardian deleted successfully')
    return response.redirect().toRoute('guardians.index')
  }

  async attachToStudent({ params, request, response, session }: HttpContext) {
    const schoolId = session.get('schoolId')
    const { studentId } = params
    const data = await request.validateUsing(attachGuardianValidator)

    try {
      await AttachGuardianToStudent.handle({
        studentId,
        guardianId: data.guardianId,
        schoolId,
        isPrimary: data.isPrimary ?? false,
        isEmergencyContact: data.isEmergencyContact ?? false,
        canPickup: data.canPickup ?? true,
      })
    } catch (error) {
      if (error?.code === 'E_DUPLICATE_GUARDIAN_LINK') {
        session.flash('error', error.message)
        return response.redirect().back()
      }
      throw error
    }

    session.flash('success', 'Guardian attached to student')
    return response.redirect().back()
  }

  async detachFromStudent({ params, response, session }: HttpContext) {
    const schoolId = session.get('schoolId')
    const { studentId, guardianId } = params

    await DetachGuardianFromStudent.handle(studentId, guardianId, schoolId)

    session.flash('success', 'Guardian removed from student')
    return response.redirect().back()
  }
}

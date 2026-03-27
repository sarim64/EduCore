import StoreEnrollment from '#actions/school/students/enrollment/store_enrollment'
import UpdateEnrollment from '#actions/school/students/enrollment/update_enrollment'
import DeleteEnrollment from '#actions/school/students/enrollment/delete_enrollment'
import { createEnrollmentValidator, updateEnrollmentValidator } from '#validators/enrollment'
import type { HttpContext } from '@adonisjs/core/http'

export default class EnrollmentsController {
  async store(ctx: HttpContext) {
    const { request, response, session, auth } = ctx
    const schoolId = session.get('schoolId')
    const data = await request.validateUsing(createEnrollmentValidator)

    try {
      await StoreEnrollment.handle({ schoolId, data, ctx, userId: auth.user!.id })

      session.flash('success', 'Student enrolled successfully')
      return response.redirect().back()
    } catch (error) {
      if (error?.code === 'E_DUPLICATE_ENROLLMENT') {
        session.flash('error', 'Student is already enrolled for this academic year')
      } else {
        session.flash('error', 'An unexpected error occurred')
      }
      return response.redirect().back()
    }
  }

  async update(ctx: HttpContext) {
    const { params, request, response, session, auth } = ctx
    const data = await request.validateUsing(updateEnrollmentValidator)

    await UpdateEnrollment.handle({ id: params.id, data, ctx, userId: auth.user!.id })

    session.flash('success', 'Enrollment updated successfully')
    return response.redirect().back()
  }

  async destroy(ctx: HttpContext) {
    const { params, response, session, auth } = ctx
    await DeleteEnrollment.handle({ id: params.id, ctx, userId: auth.user!.id })

    session.flash('success', 'Enrollment removed')
    return response.redirect().back()
  }
}

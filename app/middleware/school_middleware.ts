import School from '#models/school'
import SuperAdmin from '#models/super_admin'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import db from '@adonisjs/lucid/services/db'

/**
 * School middleware ensures that a school context is set in the session.
 * It loads the school and attaches it to the HTTP context for easy access.
 *
 * Super admins have unrestricted access to all schools.
 */
export default class SchoolMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const user = ctx.auth.user
    if (!user) {
      return ctx.response.redirect().toRoute('login.show')
    }

    const isSuperAdmin = await SuperAdmin.query()
      .where('userId', user.id)
      .whereNull('revokedAt')
      .first()

    const schoolId = ctx.session.get('schoolId')

    if (!schoolId) {
      if (isSuperAdmin) {
        return ctx.response.redirect().toRoute('admin.dashboard')
      }

      return this.#handleNoSchool(ctx)
    }

    const school = await School.find(schoolId)

    if (!school) {
      ctx.session.forget('schoolId')

      if (isSuperAdmin) {
        return ctx.response.redirect().toRoute('admin.dashboard')
      }

      return this.#handleNoSchool(ctx)
    }

    // Super admins can access any school without being a member
    if (!isSuperAdmin) {
      // Direct pivot query — no need to load all user schools
      const membership = await db
        .from('school_users')
        .where('school_id', schoolId)
        .where('user_id', user.id)
        .first()

      if (!membership) {
        ctx.session.forget('schoolId')
        return ctx.response.redirect().toRoute('schools.select')
      }
    }

    ctx.school = school
    await next()
  }

  /**
   * Called when the user is authenticated but has no school context.
   * If they belong to schools, send them to selection. Otherwise they
   * should not be logged in at all — force logout and send to login.
   */
  async #handleNoSchool(ctx: HttpContext) {
    const user = ctx.auth.user!
    const membership = await db
      .from('school_users')
      .where('user_id', user.id)
      .count('* as total')
      .first()
    const membershipCount = Number(membership?.total ?? 0)

    if (membershipCount > 0) {
      return ctx.response.redirect().toRoute('schools.select')
    }

    await ctx.auth.use('web').logout()
    ctx.session.flash(
      'error',
      'Your account is not assigned to any school. Please contact your administrator.'
    )
    return ctx.response.redirect().toRoute('login.show')
  }
}

declare module '@adonisjs/core/http' {
  interface HttpContext {
    school?: School
  }
}

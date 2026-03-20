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
      return ctx.response.redirect().toRoute('auth.login')
    }

    // Check if user is a super admin (they have unrestricted access)
    const isSuperAdmin = await SuperAdmin.query()
      .where('userId', user.id)
      .whereNull('revokedAt')
      .first()

    const schoolId = ctx.session.get('schoolId')

    if (!schoolId) {
      // If no school is set, redirect to school selection/creation
      // Super admins go to admin dashboard if no school context
      if (isSuperAdmin) {
        return ctx.response.redirect().toRoute('admin.dashboard')
      }

      const memberships = await db.from('school_users').where('user_id', user.id).count('* as total')
      const membershipCount = Number(memberships[0].total ?? 0)
      return membershipCount > 0
        ? ctx.response.redirect().toRoute('schools.select')
        : ctx.response.redirect().toRoute('schools.create')
    }

    // Load the school
    const school = await School.find(schoolId)

    if (!school) {
      // If school doesn't exist, clear the session and redirect
      ctx.session.forget('schoolId')
      if (isSuperAdmin) {
        return ctx.response.redirect().toRoute('admin.dashboard')
      }
      const memberships = await db.from('school_users').where('user_id', user.id).count('* as total')
      const membershipCount = Number(memberships[0].total ?? 0)
      return membershipCount > 0
        ? ctx.response.redirect().toRoute('schools.select')
        : ctx.response.redirect().toRoute('schools.create')
    }

    // Super admins can access any school without being a member
    if (!isSuperAdmin) {
      // Verify regular user has access to this school
      await user.load('schools')
      const hasAccess = user.schools.some((s) => s.id === schoolId)

      if (!hasAccess) {
        ctx.session.forget('schoolId')
        return ctx.response.redirect().toRoute('schools.select')
      }
    }

    // Attach school to context for easy access in controllers
    ctx.school = school

    await next()
  }
}

/**
 * Extend HttpContext to include school property
 */
declare module '@adonisjs/core/http' {
  interface HttpContext {
    school?: School
  }
}

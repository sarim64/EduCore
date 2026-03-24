import Roles from '#enums/roles'
import SuperAdmin from '#models/super_admin'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import db from '@adonisjs/lucid/services/db'

/**
 * Role middleware checks if the authenticated user has one of the allowed roles
 * for the current school context.
 *
 * Super admins bypass role checks — they have unrestricted access to all school
 * routes for troubleshooting and support purposes.
 */
export default class RoleMiddleware {
  async handle(ctx: HttpContext, next: NextFn, options: { roles: Roles[] }) {
    const user = ctx.auth.user
    const schoolId = ctx.session.get('schoolId')

    if (!user || !schoolId) {
      return ctx.response.forbidden({ message: 'Access denied' })
    }

    // Super admins have unrestricted access regardless of role
    const isSuperAdmin = await SuperAdmin.query()
      .where('userId', user.id)
      .whereNull('revokedAt')
      .first()

    if (isSuperAdmin) {
      return next()
    }

    // Get user's role for this school
    const pivot = await db
      .from('school_users')
      .where('school_id', schoolId)
      .andWhere('user_id', user.id)
      .first()

    if (!pivot) {
      return ctx.response.forbidden({ message: 'Access denied' })
    }

    const userRole = pivot.role_id as Roles

    if (!options.roles.includes(userRole)) {
      return ctx.response.forbidden({ message: 'Insufficient permissions' })
    }

    ctx.userRole = userRole

    return next()
  }
}

declare module '@adonisjs/core/http' {
  interface HttpContext {
    userRole?: Roles
  }
}

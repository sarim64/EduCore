import Roles from '#enums/roles'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import db from '@adonisjs/lucid/services/db'

/**
 * Role middleware checks if the authenticated user has one of the allowed roles
 * for the current school context.
 */
export default class RoleMiddleware {
  async handle(ctx: HttpContext, next: NextFn, options: { roles: Roles[] }) {
    const user = ctx.auth.user
    const schoolId = ctx.session.get('schoolId')

    if (!user || !schoolId) {
      return ctx.response.forbidden({ message: 'Access denied' })
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

    // Check if user has one of the allowed roles
    if (!options.roles.includes(userRole)) {
      return ctx.response.forbidden({ message: 'Insufficient permissions' })
    }

    // Attach role to context for easy access
    ctx.userRole = userRole

    await next()
  }
}

/**
 * Extend HttpContext to include userRole property
 */
declare module '@adonisjs/core/http' {
  interface HttpContext {
    userRole?: Roles
  }
}

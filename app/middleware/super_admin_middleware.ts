import SuperAdmin from '#models/super_admin'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

/**
 * SuperAdmin middleware ensures that the authenticated user is a super admin.
 * It loads the super admin record and attaches it to the HTTP context.
 */
export default class SuperAdminMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const user = ctx.auth.user

    if (!user) {
      return ctx.response.redirect().toRoute('login.show')
    }

    // Load the super admin record for this user
    const superAdmin = await SuperAdmin.query()
      .where('userId', user.id)
      .whereNull('revokedAt')
      .first()

    if (!superAdmin) {
      return ctx.response.forbidden('Access denied. Super admin privileges required.')
    }

    // Attach super admin to context for easy access in controllers
    ctx.superAdmin = superAdmin

    return next()
  }
}

/**
 * Extend HttpContext to include superAdmin property
 */
declare module '@adonisjs/core/http' {
  interface HttpContext {
    superAdmin?: SuperAdmin
  }
}

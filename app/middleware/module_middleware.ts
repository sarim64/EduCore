import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

/**
 * Module middleware — all modules are always enabled for all schools.
 * This middleware is kept for structural consistency but always passes through.
 */
export default class ModuleMiddleware {
  async handle(_ctx: HttpContext, next: NextFn, _options: { module: string }) {
    return next()
  }
}

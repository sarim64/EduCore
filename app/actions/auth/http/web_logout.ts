import AuditService from '#services/audit_service'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class WebLogout {
  constructor(protected ctx: HttpContext) {}

  async handle() {
    const user = this.ctx.auth.use('web').user
    const schoolId = this.ctx.session.get('schoolId') as string | undefined

    if (user) {
      await AuditService.logLogout(user.id, this.ctx, schoolId)
    }

    await this.ctx.auth.use('web').logout()
  }
}

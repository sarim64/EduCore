import User from '#models/user'
import SuperAdmin from '#models/super_admin'
import AuditService from '#services/audit_service'
import { loginValidator } from '#validators/auth'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { Infer } from '@vinejs/vine/types'
import { Exception } from '@adonisjs/core/exceptions'

type Params = {
  data: Infer<typeof loginValidator>
}

@inject()
export default class WebLogin {
  constructor(protected ctx: HttpContext) {}

  async handle({ data }: Params) {
    const user = await User.verifyCredentials(data.email, data.password)

    if (user.mustSetPassword) {
      throw new Exception(
        'Your account is not yet activated. Please check your email for the activation link.',
        { status: 403, code: 'E_ACCOUNT_NOT_ACTIVATED' }
      )
    }

    const isSuperAdmin = await SuperAdmin.query()
      .where('userId', user.id)
      .whereNull('revokedAt')
      .first()

    if (isSuperAdmin) {
      await this.ctx.auth.use('web').login(user)
      this.ctx.session.forget('schoolId')
      await AuditService.logLogin(user.id, this.ctx)
      return { redirect: 'admin.dashboard' as const }
    }

    const schools = await user.related('schools').query().orderBy('name', 'asc')

    if (schools.length === 0) {
      throw new Exception(
        'Your account has not been assigned to a school. Please contact your administrator.',
        { status: 403, code: 'E_NO_SCHOOL' }
      )
    }

    await this.ctx.auth.use('web').login(user)

    if (schools.length === 1) {
      const schoolId = schools[0].id
      this.ctx.session.put('schoolId', schoolId)
      await AuditService.logLogin(user.id, this.ctx, schoolId)
      return { redirect: 'dashboard' as const }
    }

    // Multi-school: log without school context; school is chosen on next step
    await AuditService.logLogin(user.id, this.ctx)
    this.ctx.session.forget('schoolId')
    return { redirect: 'schools.select' as const }
  }
}

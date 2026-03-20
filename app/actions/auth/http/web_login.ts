import User from '#models/user'
import SuperAdmin from '#models/super_admin'
import { loginValidator } from '#validators/auth'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { Infer } from '@vinejs/vine/types'

type Params = {
  data: Infer<typeof loginValidator>
}

@inject()
export default class WebLogin {
  constructor(protected ctx: HttpContext) {}

  async handle({ data }: Params) {
    const user = await User.verifyCredentials(data.email, data.password)
    await this.ctx.auth.use('web').login(user)

    const isSuperAdmin = await SuperAdmin.query()
      .where('userId', user.id)
      .whereNull('revokedAt')
      .first()

    if (isSuperAdmin) {
      this.ctx.session.forget('schoolId')
      return { redirect: '/admin' as const }
    }

    // Resolve school context deterministically.
    const schools = await user.related('schools').query().orderBy('name', 'asc')

    if (schools.length === 1) {
      this.ctx.session.put('schoolId', schools[0].id)
      return { redirect: '/' as const }
    }

    if (schools.length > 1) {
      this.ctx.session.forget('schoolId')
      return { redirect: '/schools/select' as const }
    }

    // No school memberships.
    return { redirect: '/schools/create' as const }
  }
}

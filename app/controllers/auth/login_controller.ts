import WebLogin from '#actions/auth/http/web_login'
import { loginValidator } from '#validators/auth'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

export default class LoginController {
  async show({ inertia }: HttpContext) {
    return inertia.render('auth/login')
  }

  @inject()
  async store({ request, response, session }: HttpContext, webLogin: WebLogin) {
    const data = await request.validateUsing(loginValidator)

    try {
      const result = await webLogin.handle({ data })
      return response.redirect().toPath(result.redirect)
    } catch (error) {
      session.flash('error', 'Invalid credentials')
      return response.redirect().toRoute('login.show')
    }
  }
}

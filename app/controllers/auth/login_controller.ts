import WebLogin from '#actions/auth/http/web_login'
import { loginValidator } from '#validators/auth'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

const USER_FACING_CODES = ['E_ACCOUNT_NOT_ACTIVATED', 'E_NO_SCHOOL']

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
      if (USER_FACING_CODES.includes(error.code)) {
        session.flash('error', error.message)
      } else {
        session.flash('error', 'Invalid credentials')
      }
      return response.redirect().toRoute('login.show')
    }
  }
}

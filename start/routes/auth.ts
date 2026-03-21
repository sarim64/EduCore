const LogoutController = () => import('#controllers/auth/logout_controller')
const LoginController = () => import('#controllers/auth/login_controller')
const ForgotPasswordsController = () => import('#controllers/auth/forgot_passwords_controller')
const AcceptInviteController = () => import('#controllers/auth/accept_invite_controller')
import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

router
  .group(() => {
    // Login / Logout
    router.get('login', [LoginController, 'show']).as('login.show').use(middleware.guest())
    router.post('login', [LoginController, 'store']).as('login.store').use(middleware.guest())
    router.post('logout', [LogoutController, 'handle']).as('logout').use(middleware.auth())

    // Forgot Password
    router
      .group(() => {
        router.get('/', [ForgotPasswordsController, 'index']).as('index')
        router.post('/', [ForgotPasswordsController, 'send']).as('send')
        router.get('/reset/:value', [ForgotPasswordsController, 'reset']).as('reset')
        router.post('/reset', [ForgotPasswordsController, 'update']).as('update')
      })
      .prefix('forgot-password')
      .as('forgot_password')
      .use(middleware.guest())

    // Accept Invite
    router
      .group(() => {
        router.get('/accept/:token', [AcceptInviteController, 'show']).as('show')
        router.post('/accept', [AcceptInviteController, 'store']).as('store')
      })
      .prefix('invites')
      .as('invite.accept')
      .use(middleware.guest())
  })
  .prefix('auth')

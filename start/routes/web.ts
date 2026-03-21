import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const DashboardController = () => import('#controllers/dashboard_controller')
const SchoolsController = () => import('#controllers/schools_controller')

router
  .group(() => {
    // Dashboard - redirects super admins without school context to admin dashboard
    router.get('/', [DashboardController, 'index']).as('dashboard')

    // School routes
    router.get('/schools/select', [SchoolsController, 'select']).as('schools.select')
    router.post('/schools/select', [SchoolsController, 'setActive']).as('schools.setActive')
  })
  .use(middleware.auth())

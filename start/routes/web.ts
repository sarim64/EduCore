import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import Roles from '#enums/roles'

const DashboardController = () => import('#controllers/school/dashboard_controller')
const SchoolsController = () => import('#controllers/school/schools_controller')
const AuditLogsController = () => import('#controllers/school/audit_logs_controller')

router
  .group(() => {
    // Dashboard - redirects super admins without school context to admin dashboard
    router.get('/', [DashboardController, 'index']).as('dashboard')

    // School routes
    router.get('/schools/select', [SchoolsController, 'select']).as('schools.select')
    router.post('/schools/select', [SchoolsController, 'setActive']).as('schools.setActive')
  })
  .use(middleware.auth())

router
  .group(() => {
    router.get('/', [AuditLogsController, 'index']).as('index')
  })
  .prefix('audit-logs')
  .as('audit-logs')
  .use([middleware.auth(), middleware.school(), middleware.role({ roles: [Roles.SCHOOL_ADMIN] })])

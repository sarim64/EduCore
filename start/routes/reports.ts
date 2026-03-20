import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const ReportsController = () => import('#controllers/reports_controller')

router
  .group(() => {
    router.get('/', [ReportsController, 'index']).as('reports.index')
    router.get('/enrollment', [ReportsController, 'enrollment']).as('reports.enrollment')
    router
      .get('/staff-directory', [ReportsController, 'staffDirectory'])
      .as('reports.staffDirectory')
})
  .prefix('reports')
  .use([middleware.auth(), middleware.school(), middleware.module({ module: 'reports' })])

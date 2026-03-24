const DashboardController = () => import('#controllers/superadmin/dashboard_controller')
const SchoolsController = () => import('#controllers/superadmin/schools_controller')
const SchoolAdminsController = () => import('#controllers/superadmin/school_admins_controller')
const SubscriptionPlansController = () =>
  import('#controllers/superadmin/subscription_plans_controller')
const SchoolSubscriptionsController = () =>
  import('#controllers/superadmin/school_subscriptions_controller')
const AuditLogsController = () => import('#controllers/superadmin/audit_logs_controller')

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

router
  .group(() => {
    // Dashboard
    router.get('/', [DashboardController, 'index']).as('admin.dashboard')

    // Schools CRUD
    router.get('/schools', [SchoolsController, 'index']).as('admin.schools.index')
    router.post('/schools', [SchoolsController, 'store']).as('admin.schools.store')
    router.get('/schools/:id', [SchoolsController, 'show']).as('admin.schools.show')
    router.put('/schools/:id', [SchoolsController, 'update']).as('admin.schools.update')
    router.delete('/schools/:id', [SchoolsController, 'destroy']).as('admin.schools.destroy')
    router.post('/schools/:id/suspend', [SchoolsController, 'suspend']).as('admin.schools.suspend')
    router.post('/schools/:id/activate', [SchoolsController, 'activate']).as('admin.schools.activate')
    router.post('/schools/:id/extend', [SchoolsController, 'extend']).as('admin.schools.extend')
    router.post('/schools/:id/enter', [SchoolsController, 'enterSchool']).as('admin.schools.enter')
    router.post('/schools/exit', [SchoolsController, 'exitSchool']).as('admin.schools.exit')

    // School Admins
    router
      .get('/schools/:schoolId/admins', [SchoolAdminsController, 'index'])
      .as('admin.schools.admins.index')
    router
      .get('/schools/:schoolId/admins/create', [SchoolAdminsController, 'create'])
      .as('admin.schools.admins.create')
    router
      .post('/schools/:schoolId/admins', [SchoolAdminsController, 'store'])
      .as('admin.schools.admins.store')
    router
      .delete('/schools/:schoolId/admins/:id', [SchoolAdminsController, 'destroy'])
      .as('admin.schools.admins.destroy')

    // Subscription Plans (CRUD routes stay at /admin/plans)
    router
      .group(() => {
        router.post('/', [SubscriptionPlansController, 'store']).as('store')
        router.put('/:id', [SubscriptionPlansController, 'update']).as('update')
        router.delete('/:id', [SubscriptionPlansController, 'destroy']).as('destroy')
      })
      .prefix('plans')
      .as('admin.plans')

    // Subscriptions overview (new route — renders subscriptions/index page)
    router
      .get('/subscriptions', [SubscriptionPlansController, 'index'])
      .as('admin.subscriptions.index')

    // School Subscription (legacy per-school assignment page)
    router
      .get('/schools/:schoolId/subscription', [SchoolSubscriptionsController, 'show'])
      .as('admin.schools.subscription.show')
    router
      .post('/schools/:schoolId/subscription', [SchoolSubscriptionsController, 'assign'])
      .as('admin.schools.subscription.assign')
    router
      .put('/schools/:schoolId/subscription', [SchoolSubscriptionsController, 'update'])
      .as('admin.schools.subscription.update')

    // Audit Logs
    router.get('/audit-logs', [AuditLogsController, 'index']).as('admin.audit-logs.index')
  })
  .prefix('admin')
  .use([middleware.auth(), middleware.superAdmin()])

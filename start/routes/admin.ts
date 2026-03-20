const DashboardController = () => import('#controllers/admin/dashboard_controller')
const SchoolsController = () => import('#controllers/admin/schools_controller')
const SchoolAdminsController = () => import('#controllers/admin/school_admins_controller')
const SubscriptionPlansController = () => import('#controllers/admin/subscription_plans_controller')
const SchoolSubscriptionsController = () =>
  import('#controllers/admin/school_subscriptions_controller')
const AuditLogsController = () => import('#controllers/admin/audit_logs_controller')

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

router
  .group(() => {
    // Dashboard
    router.get('/', [DashboardController, 'index']).as('admin.dashboard')

    // Schools CRUD
    router.get('/schools', [SchoolsController, 'index']).as('admin.schools.index')
    router.get('/schools/create', [SchoolsController, 'create']).as('admin.schools.create')
    router.post('/schools', [SchoolsController, 'store']).as('admin.schools.store')
    router.get('/schools/:id', [SchoolsController, 'show']).as('admin.schools.show')
    router.get('/schools/:id/edit', [SchoolsController, 'edit']).as('admin.schools.edit')
    router.put('/schools/:id', [SchoolsController, 'update']).as('admin.schools.update')
    router.delete('/schools/:id', [SchoolsController, 'destroy']).as('admin.schools.destroy')
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

    // Subscription Plans
    router
      .group(() => {
        router.get('/', [SubscriptionPlansController, 'index']).as('index')
        router.get('/create', [SubscriptionPlansController, 'create']).as('create')
        router.post('/', [SubscriptionPlansController, 'store']).as('store')
        router.get('/:id/edit', [SubscriptionPlansController, 'edit']).as('edit')
        router.put('/:id', [SubscriptionPlansController, 'update']).as('update')
        router.delete('/:id', [SubscriptionPlansController, 'destroy']).as('destroy')
      })
      .prefix('plans')
      .as('admin.plans')

    // School Subscription
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

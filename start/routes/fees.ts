import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const FeeCategoriesController = () =>
  import('#controllers/school/fees/fee_categories_controller')
const FeeStructuresController = () => import('#controllers/school/fees/fee_structures_controller')
const FeeDiscountsController = () => import('#controllers/school/fees/fee_discounts_controller')
const StudentDiscountsController = () =>
  import('#controllers/school/fees/student_discounts_controller')
const FeeChallansController = () => import('#controllers/school/fees/fee_challans_controller')
const FeePaymentsController = () => import('#controllers/school/fees/fee_payments_controller')
const FeeLedgerController = () => import('#controllers/school/fees/fee_ledger_controller')
const FeeReportsController = () => import('#controllers/school/fees/fee_reports_controller')

router
  .group(() => {
    // Fee Categories
    router
      .group(() => {
        router.get('/', [FeeCategoriesController, 'index']).as('index')
        router.get('/create', [FeeCategoriesController, 'create']).as('create')
        router.post('/', [FeeCategoriesController, 'store']).as('store')
        router.get('/:id/edit', [FeeCategoriesController, 'edit']).as('edit')
        router.put('/:id', [FeeCategoriesController, 'update']).as('update')
        router.delete('/:id', [FeeCategoriesController, 'destroy']).as('destroy')
      })
      .prefix('categories')
      .as('categories')

    // Fee Structures
    router
      .group(() => {
        router.get('/', [FeeStructuresController, 'index']).as('index')
        router.get('/create', [FeeStructuresController, 'create']).as('create')
        router.post('/', [FeeStructuresController, 'store']).as('store')
        router.post('/bulk', [FeeStructuresController, 'bulkCreate']).as('bulk-create')
        router.get('/:id/edit', [FeeStructuresController, 'edit']).as('edit')
        router.put('/:id', [FeeStructuresController, 'update']).as('update')
        router.delete('/:id', [FeeStructuresController, 'destroy']).as('destroy')
      })
      .prefix('structures')
      .as('structures')

    // Fee Discounts
    router
      .group(() => {
        router.get('/', [FeeDiscountsController, 'index']).as('index')
        router.get('/create', [FeeDiscountsController, 'create']).as('create')
        router.post('/', [FeeDiscountsController, 'store']).as('store')
        router.get('/:id/edit', [FeeDiscountsController, 'edit']).as('edit')
        router.put('/:id', [FeeDiscountsController, 'update']).as('update')
        router.delete('/:id', [FeeDiscountsController, 'destroy']).as('destroy')
      })
      .prefix('discounts')
      .as('discounts')

    // Student Discounts
    router
      .group(() => {
        router.get('/', [StudentDiscountsController, 'index']).as('index')
        router.get('/create', [StudentDiscountsController, 'create']).as('create')
        router.post('/', [StudentDiscountsController, 'store']).as('store')
        router.post('/bulk', [StudentDiscountsController, 'bulkStore']).as('bulk-store')
        router.delete('/:id', [StudentDiscountsController, 'destroy']).as('destroy')
      })
      .prefix('student-discounts')
      .as('student-discounts')

    // Fee Challans
    router
      .group(() => {
        router.get('/', [FeeChallansController, 'index']).as('index')
        router.get('/create', [FeeChallansController, 'create']).as('create')
        router.post('/', [FeeChallansController, 'store']).as('store')
        router.get('/bulk-create', [FeeChallansController, 'bulkCreate']).as('bulk-create')
        router.post('/bulk', [FeeChallansController, 'bulkStore']).as('bulk-store')
        router
          .post('/apply-late-fees', [FeeChallansController, 'applyLateFees'])
          .as('apply-late-fees')
        router.get('/:id', [FeeChallansController, 'show']).as('show')
        router.post('/:id/cancel', [FeeChallansController, 'cancel']).as('cancel')
      })
      .prefix('challans')
      .as('challans')

    // Fee Payments
    router
      .group(() => {
        router.get('/', [FeePaymentsController, 'index']).as('index')
        router.get('/challan/:challanId/create', [FeePaymentsController, 'create']).as('create')
        router.post('/', [FeePaymentsController, 'store']).as('store')
        router.post('/:id/cancel', [FeePaymentsController, 'cancel']).as('cancel')
      })
      .prefix('payments')
      .as('payments')

    // Student Fee Ledger
    router
      .group(() => {
        router.get('/:studentId', [FeeLedgerController, 'show']).as('show')
      })
      .prefix('ledger')
      .as('ledger')

    // Fee Reports
    router
      .group(() => {
        router.get('/collection', [FeeReportsController, 'collection']).as('collection')
        router.get('/defaulters', [FeeReportsController, 'defaulters']).as('defaulters')
      })
      .prefix('reports')
      .as('reports')
  })
  .prefix('fees')
  .as('fees')
  .use([middleware.auth(), middleware.school(), middleware.module({ module: 'fees' })])

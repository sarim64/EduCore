import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import Roles from '#enums/roles'

const InvitesController = () => import('#controllers/invites_controller')

router
  .group(() => {
    router.get('/', [InvitesController, 'index']).as('index')
    router.get('/create', [InvitesController, 'create']).as('create')
    router.post('/', [InvitesController, 'store']).as('store')
    router.delete('/:id', [InvitesController, 'destroy']).as('destroy')
  })
  .prefix('invites')
  .as('invites')
  .use([middleware.auth(), middleware.school(), middleware.role({ roles: [Roles.SCHOOL_ADMIN] })])

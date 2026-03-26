import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import Roles from '#enums/roles'

const AccessControlController = () => import('#controllers/school/access_control_controller')

router
  .group(() => {
    router.get('/', [AccessControlController, 'index']).as('index')
    router.post('/', [AccessControlController, 'update']).as('update')
  })
  .prefix('access-control')
  .as('accessControl')
  .use([middleware.auth(), middleware.school(), middleware.role({ roles: [Roles.SCHOOL_ADMIN] })])

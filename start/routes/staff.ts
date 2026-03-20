import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const DepartmentsController = () => import('#controllers/staff/departments_controller')
const DesignationsController = () => import('#controllers/staff/designations_controller')
const StaffController = () => import('#controllers/staff/staff_controller')
const StaffQualificationsController = () =>
  import('#controllers/staff/staff_qualifications_controller')
const StaffDocumentsController = () => import('#controllers/staff/staff_documents_controller')
const TeacherAssignmentsController = () =>
  import('#controllers/staff/teacher_assignments_controller')

router
  .group(() => {
    // Departments
    router
      .group(() => {
        router.get('/', [DepartmentsController, 'index']).as('index')
        router.get('/create', [DepartmentsController, 'create']).as('create')
        router.post('/', [DepartmentsController, 'store']).as('store')
        router.get('/:id/edit', [DepartmentsController, 'edit']).as('edit')
        router.put('/:id', [DepartmentsController, 'update']).as('update')
        router.delete('/:id', [DepartmentsController, 'destroy']).as('destroy')
      })
      .prefix('departments')
      .as('departments')

    // Designations
    router
      .group(() => {
        router.get('/', [DesignationsController, 'index']).as('index')
        router.get('/create', [DesignationsController, 'create']).as('create')
        router.post('/', [DesignationsController, 'store']).as('store')
        router.get('/:id/edit', [DesignationsController, 'edit']).as('edit')
        router.put('/:id', [DesignationsController, 'update']).as('update')
        router.delete('/:id', [DesignationsController, 'destroy']).as('destroy')
      })
      .prefix('designations')
      .as('designations')

    // Staff Members
    router
      .group(() => {
        router.get('/', [StaffController, 'index']).as('index')
        router.get('/create', [StaffController, 'create']).as('create')
        router.post('/', [StaffController, 'store']).as('store')
        router.get('/:id', [StaffController, 'show']).as('show')
        router.get('/:id/edit', [StaffController, 'edit']).as('edit')
        router.put('/:id', [StaffController, 'update']).as('update')
        router.delete('/:id', [StaffController, 'destroy']).as('destroy')

        // User account linking
        router.get('/:id/link-user', [StaffController, 'linkUserPage']).as('link-user.page')
        router.post('/:id/link-user', [StaffController, 'linkUser']).as('link-user')
        router.post('/:id/unlink-user', [StaffController, 'unlinkUser']).as('unlink-user')

        // Staff Qualifications (nested under staff member)
        router
          .group(() => {
            router.get('/', [StaffQualificationsController, 'index']).as('index')
            router.get('/create', [StaffQualificationsController, 'create']).as('create')
            router.post('/', [StaffQualificationsController, 'store']).as('store')
            router.get('/:id/edit', [StaffQualificationsController, 'edit']).as('edit')
            router.put('/:id', [StaffQualificationsController, 'update']).as('update')
            router.delete('/:id', [StaffQualificationsController, 'destroy']).as('destroy')
          })
          .prefix(':staffId/qualifications')
          .as('qualifications')

        // Staff Documents (nested under staff member)
        router
          .group(() => {
            router.get('/', [StaffDocumentsController, 'index']).as('index')
            router.get('/create', [StaffDocumentsController, 'create']).as('create')
            router.post('/', [StaffDocumentsController, 'store']).as('store')
            router.get('/:id/edit', [StaffDocumentsController, 'edit']).as('edit')
            router.put('/:id', [StaffDocumentsController, 'update']).as('update')
            router.delete('/:id', [StaffDocumentsController, 'destroy']).as('destroy')
          })
          .prefix(':staffId/documents')
          .as('documents')
      })
      .prefix('members')
      .as('members')

    // Teacher Assignments
    router
      .group(() => {
        router.get('/', [TeacherAssignmentsController, 'index']).as('index')
        router.get('/create', [TeacherAssignmentsController, 'create']).as('create')
        router.post('/', [TeacherAssignmentsController, 'store']).as('store')
        router.get('/:id/edit', [TeacherAssignmentsController, 'edit']).as('edit')
        router.put('/:id', [TeacherAssignmentsController, 'update']).as('update')
        router.delete('/:id', [TeacherAssignmentsController, 'destroy']).as('destroy')
      })
      .prefix('teacher-assignments')
      .as('teacher-assignments')
  })
  .prefix('staff')
  .as('staff')
  .use([middleware.auth(), middleware.school()])

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const StudentsController = () => import('#controllers/school/students/students_controller')
const GuardiansController = () => import('#controllers/school/students/guardians_controller')
const EnrollmentsController = () => import('#controllers/school/students/enrollments_controller')
const StudentDocumentsController = () =>
  import('#controllers/school/students/student_documents_controller')

router
  .group(() => {
    // Students CRUD
    router.get('/', [StudentsController, 'index']).as('students.index')
    router.get('/create', [StudentsController, 'create']).as('students.create')
    router.post('/', [StudentsController, 'store']).as('students.store')
    router.get('/import', [StudentsController, 'import']).as('students.import')
    router.post('/import', [StudentsController, 'processImport']).as('students.import.process')
    router.get('/:id', [StudentsController, 'show']).as('students.show')
    router.get('/:id/edit', [StudentsController, 'edit']).as('students.edit')
    router.put('/:id', [StudentsController, 'update']).as('students.update')
    router.delete('/:id', [StudentsController, 'destroy']).as('students.destroy')

    // Student-Guardian relationships
    router
      .post('/:studentId/guardians', [GuardiansController, 'attachToStudent'])
      .as('students.guardians.attach')
    router
      .delete('/:studentId/guardians/:guardianId', [GuardiansController, 'detachFromStudent'])
      .as('students.guardians.detach')

    // Enrollments
    router.post('/enrollments', [EnrollmentsController, 'store']).as('enrollments.store')
    router.put('/enrollments/:id', [EnrollmentsController, 'update']).as('enrollments.update')
    router.delete('/enrollments/:id', [EnrollmentsController, 'destroy']).as('enrollments.destroy')

    // Student Documents
    router
      .post('/:studentId/documents', [StudentDocumentsController, 'store'])
      .as('students.documents.store')
    router
      .get('/:studentId/documents/:id/download', [StudentDocumentsController, 'download'])
      .as('students.documents.download')
    router
      .delete('/:studentId/documents/:id', [StudentDocumentsController, 'destroy'])
      .as('students.documents.destroy')
  })
  .prefix('students')
  .use([middleware.auth(), middleware.school()])

// Guardians CRUD (separate from student context)
router
  .group(() => {
    router.get('/', [GuardiansController, 'index']).as('guardians.index')
    router.get('/create', [GuardiansController, 'create']).as('guardians.create')
    router.post('/', [GuardiansController, 'store']).as('guardians.store')
    router.get('/:id/edit', [GuardiansController, 'edit']).as('guardians.edit')
    router.put('/:id', [GuardiansController, 'update']).as('guardians.update')
    router.delete('/:id', [GuardiansController, 'destroy']).as('guardians.destroy')
  })
  .prefix('guardians')
  .use([middleware.auth(), middleware.school()])

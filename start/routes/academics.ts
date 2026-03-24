import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const AcademicYearsController = () =>
  import('#controllers/school/academics/academic_years_controller')
const ClassesController = () => import('#controllers/school/academics/classes_controller')
const SectionsController = () => import('#controllers/school/academics/sections_controller')
const SubjectsController = () => import('#controllers/school/academics/subjects_controller')

router
  .group(() => {
    // Academic Years
    router
      .group(() => {
        router.get('/', [AcademicYearsController, 'index']).as('index')
        router.get('/create', [AcademicYearsController, 'create']).as('create')
        router.post('/', [AcademicYearsController, 'store']).as('store')
        router.get('/:id/edit', [AcademicYearsController, 'edit']).as('edit')
        router.put('/:id', [AcademicYearsController, 'update']).as('update')
        router.delete('/:id', [AcademicYearsController, 'destroy']).as('destroy')
        router.post('/:id/set-current', [AcademicYearsController, 'setCurrent']).as('setCurrent')
      })
      .prefix('years')
      .as('years')

    // Classes
    router
      .group(() => {
        router.get('/', [ClassesController, 'index']).as('index')
        router.get('/create', [ClassesController, 'create']).as('create')
        router.post('/', [ClassesController, 'store']).as('store')
        router.get('/:id', [ClassesController, 'show']).as('show')
        router.get('/:id/edit', [ClassesController, 'edit']).as('edit')
        router.put('/:id', [ClassesController, 'update']).as('update')
        router.delete('/:id', [ClassesController, 'destroy']).as('destroy')
      })
      .prefix('classes')
      .as('classes')

    // Sections (nested under classes)
    router
      .group(() => {
        router.get('/class/:classId/create', [SectionsController, 'create']).as('create')
        router.post('/', [SectionsController, 'store']).as('store')
        router.get('/:id/edit', [SectionsController, 'edit']).as('edit')
        router.put('/:id', [SectionsController, 'update']).as('update')
        router.delete('/:id', [SectionsController, 'destroy']).as('destroy')
      })
      .prefix('sections')
      .as('sections')

    // Subjects
    router
      .group(() => {
        router.get('/', [SubjectsController, 'index']).as('index')
        router.get('/create', [SubjectsController, 'create']).as('create')
        router.post('/', [SubjectsController, 'store']).as('store')
        router.get('/:id', [SubjectsController, 'show']).as('show')
        router.get('/:id/edit', [SubjectsController, 'edit']).as('edit')
        router.put('/:id', [SubjectsController, 'update']).as('update')
        router.delete('/:id', [SubjectsController, 'destroy']).as('destroy')
        router.post('/assign', [SubjectsController, 'assignToClass']).as('assign')
        router
          .delete('/:subjectId/class/:classId', [SubjectsController, 'removeFromClass'])
          .as('removeFromClass')
      })
      .prefix('subjects')
      .as('subjects')
  })
  .prefix('academics')
  .as('academics')
  .use([middleware.auth(), middleware.school()])

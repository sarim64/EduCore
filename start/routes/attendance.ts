import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const AttendanceController = () => import('#controllers/school/attendance/attendance_controller')
const LeaveTypesController = () => import('#controllers/school/attendance/leave_types_controller')
const StudentAttendancesController = () =>
  import('#controllers/school/attendance/student_attendances_controller')
const StaffAttendancesController = () =>
  import('#controllers/school/attendance/staff_attendances_controller')
const LeaveApplicationsController = () =>
  import('#controllers/school/attendance/leave_applications_controller')
const AttendanceReportsController = () =>
  import('#controllers/school/attendance/attendance_reports_controller')

router
  .group(() => {
    // Main attendance index
    router.get('/', [AttendanceController, 'index']).as('index')

    // Leave Types
    router
      .group(() => {
        router.get('/', [LeaveTypesController, 'index']).as('index')
        router.get('/create', [LeaveTypesController, 'create']).as('create')
        router.post('/', [LeaveTypesController, 'store']).as('store')
        router.get('/:id/edit', [LeaveTypesController, 'edit']).as('edit')
        router.put('/:id', [LeaveTypesController, 'update']).as('update')
        router.delete('/:id', [LeaveTypesController, 'destroy']).as('destroy')
      })
      .prefix('leave-types')
      .as('leave-types')

    // Student Attendance
    router
      .group(() => {
        router.get('/', [StudentAttendancesController, 'index']).as('index')
        router.get('/mark', [StudentAttendancesController, 'markForm']).as('markForm')
        router.post('/mark', [StudentAttendancesController, 'mark']).as('mark')
        router.get('/bulk-mark', [StudentAttendancesController, 'bulkMarkForm']).as('bulkMarkForm')
        router.post('/bulk-mark', [StudentAttendancesController, 'bulkMark']).as('bulkMark')
        router.get('/:studentId', [StudentAttendancesController, 'studentHistory']).as('history')
      })
      .prefix('students')
      .as('students')

    // Staff Attendance
    router
      .group(() => {
        router.get('/', [StaffAttendancesController, 'index']).as('index')
        router.get('/mark', [StaffAttendancesController, 'markForm']).as('markForm')
        router.post('/mark', [StaffAttendancesController, 'mark']).as('mark')
        router.get('/bulk-mark', [StaffAttendancesController, 'bulkMarkForm']).as('bulkMarkForm')
        router.post('/bulk-mark', [StaffAttendancesController, 'bulkMark']).as('bulkMark')
        router.get('/:staffId', [StaffAttendancesController, 'staffHistory']).as('history')
      })
      .prefix('staff')
      .as('staff')

    // Leave Applications
    router
      .group(() => {
        router.get('/', [LeaveApplicationsController, 'index']).as('index')
        router.get('/apply', [LeaveApplicationsController, 'create']).as('apply')
        router.post('/', [LeaveApplicationsController, 'store']).as('store')
        router.get('/pending', [LeaveApplicationsController, 'pending']).as('pending')
        router.get('/:id', [LeaveApplicationsController, 'show']).as('show')
        router.post('/:id/approve', [LeaveApplicationsController, 'approve']).as('approve')
        router.post('/:id/reject', [LeaveApplicationsController, 'reject']).as('reject')
        router.post('/:id/cancel', [LeaveApplicationsController, 'cancel']).as('cancel')
      })
      .prefix('leaves')
      .as('leaves')

    // Reports
    router
      .group(() => {
        router.get('/', [AttendanceReportsController, 'index']).as('index')
        router.get('/daily', [AttendanceReportsController, 'daily']).as('daily')
        router.get('/monthly', [AttendanceReportsController, 'monthly']).as('monthly')
        router.get('/summary', [AttendanceReportsController, 'summary']).as('summary')
        router.get('/student/:studentId', [AttendanceReportsController, 'student']).as('student')
        router.get('/calendar', [AttendanceReportsController, 'calendar']).as('calendar')
      })
      .prefix('reports')
      .as('reports')
  })
  .prefix('attendance')
  .as('attendance')
  .use([middleware.auth(), middleware.school()])

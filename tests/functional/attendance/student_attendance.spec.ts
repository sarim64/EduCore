import { test } from '@japa/runner'
import { UserFactory } from '../../factories/user_factory.js'
import { SchoolFactory } from '../../factories/school_factory.js'
import { StudentFactory } from '../../factories/student_factory.js'
import { AcademicYearFactory } from '../../factories/academic_year_factory.js'
import { SchoolClassFactory } from '../../factories/school_class_factory.js'
import { StudentAttendanceFactory } from '../../factories/student_attendance_factory.js'
import StudentAttendance from '#models/student_attendance'
import Roles from '#enums/roles'
import { DateTime } from 'luxon'

test.group('attendance/students', () => {
  // Confirms that an authenticated user can mark single student attendance
  test('authenticated user can mark single student attendance', async ({ client, assert }) => {
    const school = await SchoolFactory.create()
    const user = await UserFactory.create()
    await school.related('users').attach({
      [user.id]: { role_id: Roles.SCHOOL_ADMIN },
    })

    const academicYear = await AcademicYearFactory.merge({
      schoolId: school.id,
      isCurrent: true,
    }).create()
    const schoolClass = await SchoolClassFactory.merge({ schoolId: school.id }).create()
    const student = await StudentFactory.merge({ schoolId: school.id }).create()

    const attendanceData = {
      studentId: student.id,
      academicYearId: academicYear.id,
      classId: schoolClass.id,
      date: DateTime.now().toISODate(),
      status: 'present',
      remarks: 'On time',
    }

    const response = await client
      .post('/attendance/students/mark')
      .loginAs(user)
      .withCsrfToken()
      .withSession({ schoolId: school.id })
      .form(attendanceData)

    response.assertRedirectsTo('/attendance/students')

    const attendance = await StudentAttendance.query()
      .where('schoolId', school.id)
      .where('studentId', student.id)
      .first()
    assert.exists(attendance)
    assert.equal(attendance?.status, 'present')
    assert.equal(attendance?.remarks, 'On time')
  })

  // Confirms that attendance can be updated for same student/date
  test('attendance can be updated for same student/date', async ({ client, assert }) => {
    const school = await SchoolFactory.create()
    const user = await UserFactory.create()
    await school.related('users').attach({
      [user.id]: { role_id: Roles.SCHOOL_ADMIN },
    })

    const academicYear = await AcademicYearFactory.merge({
      schoolId: school.id,
      isCurrent: true,
    }).create()
    const schoolClass = await SchoolClassFactory.merge({ schoolId: school.id }).create()
    const student = await StudentFactory.merge({ schoolId: school.id }).create()
    const today = DateTime.now()

    // Create existing attendance
    await StudentAttendanceFactory.merge({
      schoolId: school.id,
      studentId: student.id,
      academicYearId: academicYear.id,
      classId: schoolClass.id,
      date: today,
      status: 'present',
    }).create()

    const attendanceData = {
      studentId: student.id,
      academicYearId: academicYear.id,
      classId: schoolClass.id,
      date: today.toISODate(),
      status: 'late',
      remarks: 'Arrived 15 minutes late',
    }

    await client
      .post('/attendance/students/mark')
      .loginAs(user)
      .withCsrfToken()
      .withSession({ schoolId: school.id })
      .form(attendanceData)

    const attendance = await StudentAttendance.query()
      .where('schoolId', school.id)
      .where('studentId', student.id)
      .first()
    assert.exists(attendance)
    assert.equal(attendance?.status, 'late')
    assert.equal(attendance?.remarks, 'Arrived 15 minutes late')

    // Verify only one record exists
    const count = await StudentAttendance.query()
      .where('schoolId', school.id)
      .where('studentId', student.id)
      .count('* as total')
    assert.equal(Number(count[0].$extras.total), 1)
  })

  // Validates that attendance cannot be marked for future dates
  test('cannot mark attendance for future dates', async ({ client, assert }) => {
    const school = await SchoolFactory.create()
    const user = await UserFactory.create()
    await school.related('users').attach({
      [user.id]: { role_id: Roles.SCHOOL_ADMIN },
    })

    const academicYear = await AcademicYearFactory.merge({
      schoolId: school.id,
      isCurrent: true,
    }).create()
    const schoolClass = await SchoolClassFactory.merge({ schoolId: school.id }).create()
    const student = await StudentFactory.merge({ schoolId: school.id }).create()

    const attendanceData = {
      studentId: student.id,
      academicYearId: academicYear.id,
      classId: schoolClass.id,
      date: DateTime.now().plus({ days: 1 }).toISODate(),
      status: 'present',
    }

    await client
      .post('/attendance/students/mark')
      .loginAs(user)
      .withCsrfToken()
      .withSession({ schoolId: school.id })
      .withInertia()
      .form(attendanceData)

    // Should not have created attendance for future date
    const attendance = await StudentAttendance.query()
      .where('schoolId', school.id)
      .where('studentId', student.id)
      .first()
    assert.isNull(attendance)
  })

  // Validates that status must be one of allowed values
  test('validates status is one of allowed values', async ({ client, assert }) => {
    const school = await SchoolFactory.create()
    const user = await UserFactory.create()
    await school.related('users').attach({
      [user.id]: { role_id: Roles.SCHOOL_ADMIN },
    })

    const academicYear = await AcademicYearFactory.merge({
      schoolId: school.id,
      isCurrent: true,
    }).create()
    const schoolClass = await SchoolClassFactory.merge({ schoolId: school.id }).create()
    const student = await StudentFactory.merge({ schoolId: school.id }).create()

    const attendanceData = {
      studentId: student.id,
      academicYearId: academicYear.id,
      classId: schoolClass.id,
      date: DateTime.now().toISODate(),
      status: 'invalid_status',
    }

    await client
      .post('/attendance/students/mark')
      .loginAs(user)
      .withCsrfToken()
      .withSession({ schoolId: school.id })
      .form(attendanceData)

    // Verify attendance was NOT created with invalid status
    const attendanceRecord = await StudentAttendance.query()
      .where('studentId', student.id)
      .where('date', attendanceData.date)
      .first()
    assert.isNull(attendanceRecord, 'Attendance with invalid status should not be created')
  })

  // Confirms that student must belong to school
  test('student must belong to school', async ({ client, assert }) => {
    const school1 = await SchoolFactory.create()
    const school2 = await SchoolFactory.create()
    const user = await UserFactory.create()
    await school1.related('users').attach({
      [user.id]: { role_id: Roles.SCHOOL_ADMIN },
    })

    const academicYear = await AcademicYearFactory.merge({
      schoolId: school1.id,
      isCurrent: true,
    }).create()
    const schoolClass = await SchoolClassFactory.merge({ schoolId: school1.id }).create()
    // Student belongs to school2, not school1
    const student = await StudentFactory.merge({ schoolId: school2.id }).create()

    const attendanceData = {
      studentId: student.id,
      academicYearId: academicYear.id,
      classId: schoolClass.id,
      date: DateTime.now().toISODate(),
      status: 'present',
    }

    await client
      .post('/attendance/students/mark')
      .loginAs(user)
      .withCsrfToken()
      .withSession({ schoolId: school1.id })
      .form(attendanceData)

    // Should not have created attendance for student from different school
    const attendance = await StudentAttendance.query()
      .where('schoolId', school1.id)
      .where('studentId', student.id)
      .first()
    assert.isNull(attendance)
  })

  // Confirms that authenticated user can view attendance history
  test('authenticated user can view student attendance history', async ({ client }) => {
    const school = await SchoolFactory.create()
    const user = await UserFactory.create()
    await school.related('users').attach({
      [user.id]: { role_id: Roles.SCHOOL_ADMIN },
    })

    const academicYear = await AcademicYearFactory.merge({ schoolId: school.id }).create()
    const student = await StudentFactory.merge({ schoolId: school.id }).create()

    // Create attendance records with unique dates to avoid unique constraint violation
    for (let i = 0; i < 5; i++) {
      await StudentAttendanceFactory.merge({
        schoolId: school.id,
        studentId: student.id,
        academicYearId: academicYear.id,
        date: DateTime.now().minus({ days: i }),
      }).create()
    }

    const response = await client
      .get(`/attendance/students/${student.id}`)
      .loginAs(user)
      .withSession({ schoolId: school.id })
      .withInertia()

    response.assertStatus(200)
    response.assertInertiaComponent('attendance/students/history')
  })

  // Ensures unauthenticated users are redirected
  test('unauthenticated users are redirected to login', async ({ client }) => {
    const response = await client.get('/attendance/students')

    response.assertRedirectsTo('/auth/login')
  })
})

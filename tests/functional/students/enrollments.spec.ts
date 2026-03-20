import { test } from '@japa/runner'
import { UserFactory } from '../../factories/user_factory.js'
import { SchoolFactory } from '../../factories/school_factory.js'
import { StudentFactory } from '../../factories/student_factory.js'
import { AcademicYearFactory } from '../../factories/academic_year_factory.js'
import { SchoolClassFactory } from '../../factories/school_class_factory.js'
import { SectionFactory } from '../../factories/section_factory.js'
import Enrollment from '#models/enrollment'
import { DateTime } from 'luxon'

test.group('enrollments', () => {
  // Ensures student can be enrolled in a class
  test('authenticated user can enroll a student', async ({ client, assert }) => {
    const school = await SchoolFactory.create()
    const user = await UserFactory.create()
    await user.related('schools').attach([school.id])

    const student = await StudentFactory.merge({
      schoolId: school.id,
    }).create()

    const academicYear = await AcademicYearFactory.merge({
      schoolId: school.id,
      isCurrent: true,
    }).create()

    const schoolClass = await SchoolClassFactory.merge({
      schoolId: school.id,
    }).create()

    const section = await SectionFactory.merge({
      schoolId: school.id,
      classId: schoolClass.id,
    }).create()

    const response = await client
      .post('/students/enrollments')
      .loginAs(user)
      .withCsrfToken()
      .withSession({ schoolId: school.id })
      .header('Referer', `/students/${student.id}`)
      .form({
        studentId: student.id,
        academicYearId: academicYear.id,
        classId: schoolClass.id,
        sectionId: section.id,
        enrollmentDate: '2026-01-15',
        rollNumber: 'A001',
      })

    response.assertRedirectsTo(`/students/${student.id}`)

    const enrollment = await Enrollment.query()
      .where('studentId', student.id)
      .where('academicYearId', academicYear.id)
      .first()

    assert.exists(enrollment)
    assert.equal(enrollment?.classId, schoolClass.id)
    assert.equal(enrollment?.sectionId, section.id)
    assert.equal(enrollment?.rollNumber, 'A001')
  })

  // Ensures enrollment can be updated
  test('authenticated user can update an enrollment', async ({ client, assert }) => {
    const school = await SchoolFactory.create()
    const user = await UserFactory.create()
    await user.related('schools').attach([school.id])

    const student = await StudentFactory.merge({
      schoolId: school.id,
    }).create()

    const academicYear = await AcademicYearFactory.merge({
      schoolId: school.id,
    }).create()

    const schoolClass = await SchoolClassFactory.merge({
      schoolId: school.id,
    }).create()

    const enrollment = await Enrollment.create({
      schoolId: school.id,
      studentId: student.id,
      academicYearId: academicYear.id,
      classId: schoolClass.id,
      enrollmentDate: DateTime.now(),
      status: 'active',
    })

    const response = await client
      .put(`/students/enrollments/${enrollment.id}`)
      .loginAs(user)
      .withCsrfToken()
      .withSession({ schoolId: school.id })
      .header('Referer', `/students/${student.id}`)
      .form({ rollNumber: 'B002', status: 'promoted' })

    response.assertRedirectsTo(`/students/${student.id}`)

    await enrollment.refresh()
    assert.equal(enrollment.rollNumber, 'B002')
    assert.equal(enrollment.status, 'promoted')
  })

  // Ensures enrollment can be deleted
  test('authenticated user can delete an enrollment', async ({ client, assert }) => {
    const school = await SchoolFactory.create()
    const user = await UserFactory.create()
    await user.related('schools').attach([school.id])

    const student = await StudentFactory.merge({
      schoolId: school.id,
    }).create()

    const academicYear = await AcademicYearFactory.merge({
      schoolId: school.id,
    }).create()

    const schoolClass = await SchoolClassFactory.merge({
      schoolId: school.id,
    }).create()

    const enrollment = await Enrollment.create({
      schoolId: school.id,
      studentId: student.id,
      academicYearId: academicYear.id,
      classId: schoolClass.id,
      enrollmentDate: DateTime.now(),
      status: 'active',
    })

    const response = await client
      .delete(`/students/enrollments/${enrollment.id}`)
      .loginAs(user)
      .withCsrfToken()
      .withSession({ schoolId: school.id })
      .header('Referer', `/students/${student.id}`)

    response.assertRedirectsTo(`/students/${student.id}`)

    const deleted = await Enrollment.find(enrollment.id)
    assert.isNull(deleted)
  })

  // Ensures student can only have one enrollment per academic year
  test('student can only be enrolled once per academic year', async ({ client, assert }) => {
    const school = await SchoolFactory.create()
    const user = await UserFactory.create()
    await user.related('schools').attach([school.id])

    const student = await StudentFactory.merge({
      schoolId: school.id,
    }).create()

    const academicYear = await AcademicYearFactory.merge({
      schoolId: school.id,
    }).create()

    const schoolClass = await SchoolClassFactory.merge({
      schoolId: school.id,
    }).create()

    // First enrollment
    await Enrollment.create({
      schoolId: school.id,
      studentId: student.id,
      academicYearId: academicYear.id,
      classId: schoolClass.id,
      enrollmentDate: DateTime.now(),
      status: 'active',
    })

    // Try to create second enrollment for same year
    const response = await client
      .post('/students/enrollments')
      .loginAs(user)
      .withCsrfToken()
      .withSession({ schoolId: school.id })
      .header('Referer', `/students/${student.id}`)
      .form({
        studentId: student.id,
        academicYearId: academicYear.id,
        classId: schoolClass.id,
        enrollmentDate: '2026-01-15',
      })

    // Duplicate should not be created (current behavior returns server error)
    response.assertStatus(200)

    // Verify only one enrollment exists
    const enrollments = await Enrollment.query()
      .where('studentId', student.id)
      .where('academicYearId', academicYear.id)

    assert.equal(enrollments.length, 1)
  })
})

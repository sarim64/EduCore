import { test } from '@japa/runner'
import { UserFactory } from '../../factories/user_factory.js'
import { SchoolFactory } from '../../factories/school_factory.js'
import { DepartmentFactory } from '../../factories/department_factory.js'
import { DesignationFactory } from '../../factories/designation_factory.js'
import { StaffFactory } from '../../factories/staff_factory.js'
import { AcademicYearFactory } from '../../factories/academic_year_factory.js'
import { SchoolClassFactory } from '../../factories/school_class_factory.js'
import { SubjectFactory } from '../../factories/subject_factory.js'
import { TeacherAssignmentFactory } from '../../factories/teacher_assignment_factory.js'
import TeacherAssignment from '#models/teacher_assignment'

test.group('staff/teacher-assignments', () => {
  // Ensures authenticated user can view teacher assignments
  test('authenticated user can view teacher assignments', async ({ client }) => {
    const school = await SchoolFactory.create()
    const user = await UserFactory.create()
    await user.related('schools').attach([school.id])

    const department = await DepartmentFactory.merge({ schoolId: school.id }).create()
    const designation = await DesignationFactory.merge({
      schoolId: school.id,
      departmentId: department.id,
    }).create()
    const staff = await StaffFactory.merge({
      schoolId: school.id,
      departmentId: department.id,
      designationId: designation.id,
    }).create()

    const academicYear = await AcademicYearFactory.merge({ schoolId: school.id }).create()
    const schoolClass = await SchoolClassFactory.merge({ schoolId: school.id }).create()
    const subject = await SubjectFactory.merge({ schoolId: school.id }).create()

    await TeacherAssignmentFactory.merge({
      schoolId: school.id,
      staffMemberId: staff.id,
      academicYearId: academicYear.id,
      classId: schoolClass.id,
      subjectId: subject.id,
    }).create()

    const response = await client
      .get('/staff/teacher-assignments')
      .loginAs(user)
      .withCsrfToken()
      .withSession({ schoolId: school.id })
      .withInertia()

    response.assertStatus(200)
    response.assertInertiaComponent('staff/teacher-assignments/index')
  })

  // Ensures authenticated user can create a teacher assignment
  test('authenticated user can create a teacher assignment', async ({ client, assert }) => {
    const school = await SchoolFactory.create()
    const user = await UserFactory.create()
    await user.related('schools').attach([school.id])

    const department = await DepartmentFactory.merge({ schoolId: school.id }).create()
    const designation = await DesignationFactory.merge({
      schoolId: school.id,
      departmentId: department.id,
    }).create()
    const staff = await StaffFactory.merge({
      schoolId: school.id,
      departmentId: department.id,
      designationId: designation.id,
    }).create()

    const academicYear = await AcademicYearFactory.merge({ schoolId: school.id }).create()
    const schoolClass = await SchoolClassFactory.merge({ schoolId: school.id }).create()
    const subject = await SubjectFactory.merge({ schoolId: school.id }).create()

    const assignmentData = {
      staffMemberId: staff.id,
      academicYearId: academicYear.id,
      classId: schoolClass.id,
      subjectId: subject.id,
      isClassTeacher: true,
    }

    const response = await client
      .post('/staff/teacher-assignments')
      .loginAs(user)
      .withCsrfToken()
      .withSession({ schoolId: school.id })
      .form(assignmentData)

    response.assertRedirectsTo('/staff/teacher-assignments')

    const assignment = await TeacherAssignment.query()
      .where('staffMemberId', staff.id)
      .where('subjectId', subject.id)
      .first()
    assert.exists(assignment)
    assert.equal(assignment?.academicYearId, academicYear.id)
    assert.equal(assignment?.classId, schoolClass.id)
    assert.isTrue(assignment?.isClassTeacher)
  })

  // Ensures teacher assignment can be updated
  test('authenticated user can update a teacher assignment', async ({ client, assert }) => {
    const school = await SchoolFactory.create()
    const user = await UserFactory.create()
    await user.related('schools').attach([school.id])

    const department = await DepartmentFactory.merge({ schoolId: school.id }).create()
    const designation = await DesignationFactory.merge({
      schoolId: school.id,
      departmentId: department.id,
    }).create()
    const staff = await StaffFactory.merge({
      schoolId: school.id,
      departmentId: department.id,
      designationId: designation.id,
    }).create()

    const academicYear = await AcademicYearFactory.merge({ schoolId: school.id }).create()
    const schoolClass = await SchoolClassFactory.merge({ schoolId: school.id }).create()
    const subject = await SubjectFactory.merge({ schoolId: school.id }).create()

    const assignment = await TeacherAssignmentFactory.merge({
      schoolId: school.id,
      staffMemberId: staff.id,
      academicYearId: academicYear.id,
      classId: schoolClass.id,
      subjectId: subject.id,
      isClassTeacher: false,
    }).create()

    const response = await client
      .put(`/staff/teacher-assignments/${assignment.id}`)
      .loginAs(user)
      .withCsrfToken()
      .withSession({ schoolId: school.id })
      .form({ isClassTeacher: true, notes: 'Updated notes' })

    response.assertRedirectsTo('/staff/teacher-assignments')

    await assignment.refresh()
    assert.isTrue(assignment.isClassTeacher)
    assert.equal(assignment.notes, 'Updated notes')
  })

  // Ensures teacher assignment can be deleted
  test('authenticated user can delete a teacher assignment', async ({ client, assert }) => {
    const school = await SchoolFactory.create()
    const user = await UserFactory.create()
    await user.related('schools').attach([school.id])

    const department = await DepartmentFactory.merge({ schoolId: school.id }).create()
    const designation = await DesignationFactory.merge({
      schoolId: school.id,
      departmentId: department.id,
    }).create()
    const staff = await StaffFactory.merge({
      schoolId: school.id,
      departmentId: department.id,
      designationId: designation.id,
    }).create()

    const academicYear = await AcademicYearFactory.merge({ schoolId: school.id }).create()
    const schoolClass = await SchoolClassFactory.merge({ schoolId: school.id }).create()
    const subject = await SubjectFactory.merge({ schoolId: school.id }).create()

    const assignment = await TeacherAssignmentFactory.merge({
      schoolId: school.id,
      staffMemberId: staff.id,
      academicYearId: academicYear.id,
      classId: schoolClass.id,
      subjectId: subject.id,
    }).create()

    const response = await client
      .delete(`/staff/teacher-assignments/${assignment.id}`)
      .loginAs(user)
      .withCsrfToken()
      .withSession({ schoolId: school.id })

    response.assertRedirectsTo('/staff/teacher-assignments')

    const deleted = await TeacherAssignment.find(assignment.id)
    assert.isNull(deleted)
  })

  // Ensures unauthenticated users are redirected
  test('unauthenticated users are redirected to login', async ({ client }) => {
    const response = await client.get('/staff/teacher-assignments').withCsrfToken()

    response.assertRedirectsTo('/auth/login')
  })

  // Ensures validation fails without required fields
  test('validation fails without required fields', async ({ client, assert }) => {
    const school = await SchoolFactory.create()
    const user = await UserFactory.create()
    await user.related('schools').attach([school.id])

    const before = await TeacherAssignment.query().where('schoolId', school.id).count('* as total')

    const response = await client
      .post('/staff/teacher-assignments')
      .loginAs(user)
      .withCsrfToken()
      .withSession({ schoolId: school.id })
      .redirects(0)
      .form({})

    // Validation error redirects back with flash errors
    response.assertStatus(302)
    assert.exists(response.flashMessage('errors'))

    const after = await TeacherAssignment.query().where('schoolId', school.id).count('* as total')
    assert.equal(Number(after[0].$extras.total), Number(before[0].$extras.total))
  })

  // Ensures assignments are scoped to the current school
  test('assignments are scoped to the current school', async ({ client, assert }) => {
    const school1 = await SchoolFactory.create()
    const school2 = await SchoolFactory.create()
    const user = await UserFactory.create()
    await user.related('schools').attach([school1.id, school2.id])

    // Create assignment for school1
    const department1 = await DepartmentFactory.merge({ schoolId: school1.id }).create()
    const designation1 = await DesignationFactory.merge({
      schoolId: school1.id,
      departmentId: department1.id,
    }).create()
    const staff1 = await StaffFactory.merge({
      schoolId: school1.id,
      departmentId: department1.id,
      designationId: designation1.id,
    }).create()
    const academicYear1 = await AcademicYearFactory.merge({ schoolId: school1.id }).create()
    const schoolClass1 = await SchoolClassFactory.merge({ schoolId: school1.id }).create()
    const subject1 = await SubjectFactory.merge({ schoolId: school1.id }).create()
    await TeacherAssignmentFactory.merge({
      schoolId: school1.id,
      staffMemberId: staff1.id,
      academicYearId: academicYear1.id,
      classId: schoolClass1.id,
      subjectId: subject1.id,
    }).create()

    // Create assignment for school2
    const department2 = await DepartmentFactory.merge({ schoolId: school2.id }).create()
    const designation2 = await DesignationFactory.merge({
      schoolId: school2.id,
      departmentId: department2.id,
    }).create()
    const staff2 = await StaffFactory.merge({
      schoolId: school2.id,
      departmentId: department2.id,
      designationId: designation2.id,
    }).create()
    const academicYear2 = await AcademicYearFactory.merge({ schoolId: school2.id }).create()
    const schoolClass2 = await SchoolClassFactory.merge({ schoolId: school2.id }).create()
    const subject2 = await SubjectFactory.merge({ schoolId: school2.id }).create()
    await TeacherAssignmentFactory.merge({
      schoolId: school2.id,
      staffMemberId: staff2.id,
      academicYearId: academicYear2.id,
      classId: schoolClass2.id,
      subjectId: subject2.id,
    }).create()

    // Request with school1 session
    const response = await client
      .get('/staff/teacher-assignments')
      .loginAs(user)
      .withCsrfToken()
      .withSession({ schoolId: school1.id })
      .withInertia()

    response.assertStatus(200)
    const assignments = response.inertiaProps.assignments as { staffMemberId: string }[]
    assert.lengthOf(assignments, 1)
    assert.equal(assignments[0].staffMemberId, staff1.id)
  })

  // Ensures user cannot access assignment from another school
  test('user cannot access assignment from another school', async ({ client }) => {
    const school1 = await SchoolFactory.create()
    const school2 = await SchoolFactory.create()
    const user = await UserFactory.create()
    await user.related('schools').attach([school1.id])

    const department = await DepartmentFactory.merge({ schoolId: school2.id }).create()
    const designation = await DesignationFactory.merge({
      schoolId: school2.id,
      departmentId: department.id,
    }).create()
    const staff = await StaffFactory.merge({
      schoolId: school2.id,
      departmentId: department.id,
      designationId: designation.id,
    }).create()
    const academicYear = await AcademicYearFactory.merge({ schoolId: school2.id }).create()
    const schoolClass = await SchoolClassFactory.merge({ schoolId: school2.id }).create()
    const subject = await SubjectFactory.merge({ schoolId: school2.id }).create()

    const assignment = await TeacherAssignmentFactory.merge({
      schoolId: school2.id,
      staffMemberId: staff.id,
      academicYearId: academicYear.id,
      classId: schoolClass.id,
      subjectId: subject.id,
    }).create()

    const response = await client
      .get(`/staff/teacher-assignments/${assignment.id}/edit`)
      .loginAs(user)
      .withCsrfToken()
      .withSession({ schoolId: school1.id })

    response.assertStatus(404)
  })
})

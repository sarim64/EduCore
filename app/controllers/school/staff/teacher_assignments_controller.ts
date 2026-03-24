import ListTeacherAssignments from '#actions/school/staff/teacher_assignment/list_teacher_assignments'
import GetTeacherAssignment from '#actions/school/staff/teacher_assignment/get_teacher_assignment'
import StoreTeacherAssignment from '#actions/school/staff/teacher_assignment/store_teacher_assignment'
import UpdateTeacherAssignment from '#actions/school/staff/teacher_assignment/update_teacher_assignment'
import DeleteTeacherAssignment from '#actions/school/staff/teacher_assignment/delete_teacher_assignment'
import ListStaff from '#actions/school/staff/staff/list_staff'
import ListAcademicYears from '#actions/school/academics/year/list_academic_years'
import ListClasses from '#actions/school/academics/class/list_classes'
import ListSections from '#actions/school/academics/section/list_sections'
import ListSubjects from '#actions/school/academics/subject/list_subjects'
import TeacherAssignmentDto from '#dtos/teacher_assignment'
import StaffDto from '#dtos/staff_member'
import AcademicYearDto from '#dtos/academic_year'
import SchoolClassDto from '#dtos/school_class'
import SectionDto from '#dtos/section'
import SubjectDto from '#dtos/subject'
import {
  createTeacherAssignmentValidator,
  updateTeacherAssignmentValidator,
} from '#validators/teacher_assignment'
import type { HttpContext } from '@adonisjs/core/http'

export default class TeacherAssignmentsController {
  async index({ session, inertia }: HttpContext) {
    const schoolId = session.get('schoolId')
    const assignments = await ListTeacherAssignments.handle({ schoolId })

    return inertia.render('school/staff/teacher-assignments/index', {
      assignments: TeacherAssignmentDto.fromArray(assignments),
    })
  }

  async create({ session, inertia }: HttpContext) {
    const schoolId = session.get('schoolId')

    const [staff, academicYears, classes, sections, subjects] = await Promise.all([
      ListStaff.handle({ schoolId, status: 'active' }),
      ListAcademicYears.handle({ schoolId }),
      ListClasses.handle({ schoolId }),
      ListSections.handle({ schoolId }),
      ListSubjects.handle({ schoolId }),
    ])

    return inertia.render('school/staff/teacher-assignments/create', {
      staff: StaffDto.fromArray(staff),
      academicYears: AcademicYearDto.fromArray(academicYears),
      classes: SchoolClassDto.fromArray(classes),
      sections: SectionDto.fromArray(sections),
      subjects: SubjectDto.fromArray(subjects),
    })
  }

  async store({ request, response, session }: HttpContext) {
    const schoolId = session.get('schoolId')
    const data = await request.validateUsing(createTeacherAssignmentValidator)

    await StoreTeacherAssignment.handle({ schoolId, data })

    session.flash('success', 'Teacher assignment created successfully')
    return response.redirect().toRoute('staff.teacher-assignments.index')
  }

  async edit({ params, session, inertia }: HttpContext) {
    const schoolId = session.get('schoolId')
    const assignment = await GetTeacherAssignment.handle({
      assignmentId: params.id,
      schoolId,
    })

    const [staff, academicYears, classes, sections, subjects] = await Promise.all([
      ListStaff.handle({ schoolId, status: 'active' }),
      ListAcademicYears.handle({ schoolId }),
      ListClasses.handle({ schoolId }),
      ListSections.handle({ schoolId }),
      ListSubjects.handle({ schoolId }),
    ])

    return inertia.render('school/staff/teacher-assignments/edit', {
      assignment: new TeacherAssignmentDto(assignment),
      staff: StaffDto.fromArray(staff),
      academicYears: AcademicYearDto.fromArray(academicYears),
      classes: SchoolClassDto.fromArray(classes),
      sections: SectionDto.fromArray(sections),
      subjects: SubjectDto.fromArray(subjects),
    })
  }

  async update({ params, request, response, session }: HttpContext) {
    const schoolId = session.get('schoolId')
    const data = await request.validateUsing(updateTeacherAssignmentValidator)

    await UpdateTeacherAssignment.handle({
      assignmentId: params.id,
      schoolId,
      data,
    })

    session.flash('success', 'Teacher assignment updated successfully')
    return response.redirect().toRoute('staff.teacher-assignments.index')
  }

  async destroy({ params, response, session }: HttpContext) {
    const schoolId = session.get('schoolId')
    await DeleteTeacherAssignment.handle({
      assignmentId: params.id,
      schoolId,
    })

    session.flash('success', 'Teacher assignment deleted successfully')
    return response.redirect().toRoute('staff.teacher-assignments.index')
  }
}

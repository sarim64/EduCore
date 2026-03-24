import SchoolClass from '#models/school_class'
import ListSubjects from '#actions/school/academics/subject/list_subjects'
import GetSubject from '#actions/school/academics/subject/get_subject'
import StoreSubject from '#actions/school/academics/subject/store_subject'
import UpdateSubject from '#actions/school/academics/subject/update_subject'
import DeleteSubject from '#actions/school/academics/subject/delete_subject'
import AssignSubjectToClass from '#actions/school/academics/class/assign_subject_to_class'
import RemoveSubjectFromClass from '#actions/school/academics/class/remove_subject_from_class'
import {
  createSubjectValidator,
  updateSubjectValidator,
  assignSubjectToClassValidator,
} from '#validators/subject'
import type { HttpContext } from '@adonisjs/core/http'

export default class SubjectsController {
  async index({ session, inertia }: HttpContext) {
    const schoolId = session.get('schoolId')
    const subjects = await ListSubjects.handle({ schoolId })

    return inertia.render('school/academics/subjects/index', { subjects })
  }

  async create({ inertia }: HttpContext) {
    return inertia.render('school/academics/subjects/create')
  }

  async store({ request, response, session }: HttpContext) {
    const schoolId = session.get('schoolId')
    const data = await request.validateUsing(createSubjectValidator, {
      meta: { schoolId },
    })

    await StoreSubject.handle({ schoolId, data })

    session.flash('success', 'Subject created successfully')
    return response.redirect().toRoute('academics.subjects.index')
  }

  async show({ params, session, inertia }: HttpContext) {
    const schoolId = session.get('schoolId')
    const subject = await GetSubject.handle({
      subjectId: params.id,
      schoolId,
    })

    // Get all classes for assignment
    const allClasses = await SchoolClass.query()
      .where('schoolId', schoolId)
      .orderBy('displayOrder', 'asc')

    return inertia.render('school/academics/subjects/show', { subject, allClasses })
  }

  async edit({ params, session, inertia }: HttpContext) {
    const schoolId = session.get('schoolId')
    const subject = await GetSubject.handle({
      subjectId: params.id,
      schoolId,
    })

    return inertia.render('school/academics/subjects/edit', { subject })
  }

  async update({ params, request, response, session }: HttpContext) {
    const schoolId = session.get('schoolId')
    const data = await request.validateUsing(updateSubjectValidator, {
      meta: { schoolId, subjectId: params.id },
    })

    await UpdateSubject.handle({
      subjectId: params.id,
      schoolId,
      data,
    })

    session.flash('success', 'Subject updated successfully')
    return response.redirect().toRoute('academics.subjects.index')
  }

  async destroy({ params, response, session }: HttpContext) {
    const schoolId = session.get('schoolId')

    await DeleteSubject.handle({
      subjectId: params.id,
      schoolId,
    })

    session.flash('success', 'Subject deleted successfully')
    return response.redirect().toRoute('academics.subjects.index')
  }

  async assignToClass({ request, response, session }: HttpContext) {
    const schoolId = session.get('schoolId')
    const data = await request.validateUsing(assignSubjectToClassValidator)

    await AssignSubjectToClass.handle({
      schoolId,
      classId: data.classId,
      subjectId: data.subjectId,
      periodsPerWeek: data.periodsPerWeek,
      isMandatory: data.isMandatory,
    })

    session.flash('success', 'Subject assigned to class')
    return response.redirect().back()
  }

  async removeFromClass({ params, response, session }: HttpContext) {
    const schoolId = session.get('schoolId')
    const { subjectId, classId } = params

    await RemoveSubjectFromClass.handle({
      schoolId,
      subjectId,
      classId,
    })

    session.flash('success', 'Subject removed from class')
    return response.redirect().back()
  }
}

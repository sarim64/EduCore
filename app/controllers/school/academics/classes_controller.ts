import ListClasses from '#actions/school/academics/class/list_classes'
import GetClass from '#actions/school/academics/class/get_class'
import StoreClass from '#actions/school/academics/class/store_class'
import UpdateClass from '#actions/school/academics/class/update_class'
import DeleteClass from '#actions/school/academics/class/delete_class'
import { createClassValidator, updateClassValidator } from '#validators/school_class'
import type { HttpContext } from '@adonisjs/core/http'

export default class ClassesController {
  async index({ session, inertia }: HttpContext) {
    const schoolId = session.get('schoolId')
    const classes = await ListClasses.handle({ schoolId })

    return inertia.render('school/academics/classes/index', { classes })
  }

  async create({ inertia }: HttpContext) {
    return inertia.render('school/academics/classes/create')
  }

  async store({ request, response, session }: HttpContext) {
    const schoolId = session.get('schoolId')
    const data = await request.validateUsing(createClassValidator, {
      meta: { schoolId },
    })

    await StoreClass.handle({ schoolId, data })

    session.flash('success', 'Class created successfully')
    return response.redirect().toRoute('academics.classes.index')
  }

  async show({ params, session, inertia }: HttpContext) {
    const schoolId = session.get('schoolId')
    const schoolClass = await GetClass.handle({
      classId: params.id,
      schoolId,
    })

    return inertia.render('school/academics/classes/show', { schoolClass })
  }

  async edit({ params, session, inertia }: HttpContext) {
    const schoolId = session.get('schoolId')
    const schoolClass = await GetClass.handle({
      classId: params.id,
      schoolId,
    })

    return inertia.render('school/academics/classes/edit', { schoolClass })
  }

  async update({ params, request, response, session }: HttpContext) {
    const schoolId = session.get('schoolId')
    const data = await request.validateUsing(updateClassValidator, {
      meta: { schoolId, classId: params.id },
    })

    await UpdateClass.handle({
      classId: params.id,
      schoolId,
      data,
    })

    session.flash('success', 'Class updated successfully')
    return response.redirect().toRoute('academics.classes.index')
  }

  async destroy({ params, response, session }: HttpContext) {
    const schoolId = session.get('schoolId')

    await DeleteClass.handle({
      classId: params.id,
      schoolId,
    })

    session.flash('success', 'Class deleted successfully')
    return response.redirect().toRoute('academics.classes.index')
  }
}

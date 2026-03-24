import GetClass from '#actions/school/academics/class/get_class'
import GetSection from '#actions/school/academics/section/get_section'
import StoreSection from '#actions/school/academics/section/store_section'
import UpdateSection from '#actions/school/academics/section/update_section'
import DeleteSection from '#actions/school/academics/section/delete_section'
import { createSectionValidator, updateSectionValidator } from '#validators/section'
import type { HttpContext } from '@adonisjs/core/http'

export default class SectionsController {
  async create({ params, session, inertia }: HttpContext) {
    const schoolId = session.get('schoolId')
    const schoolClass = await GetClass.handle({
      classId: params.classId,
      schoolId,
    })

    return inertia.render('school/academics/sections/create', { schoolClass })
  }

  async store({ request, response, session }: HttpContext) {
    const schoolId = session.get('schoolId')
    const data = await request.validateUsing(createSectionValidator, {
      meta: { schoolId },
    })

    await StoreSection.handle({ schoolId, data })

    session.flash('success', 'Section created successfully')
    return response.redirect().toRoute('academics.classes.show', { id: data.classId })
  }

  async edit({ params, session, inertia }: HttpContext) {
    const schoolId = session.get('schoolId')
    const section = await GetSection.handle({
      sectionId: params.id,
      schoolId,
    })

    return inertia.render('school/academics/sections/edit', { section })
  }

  async update({ params, request, response, session }: HttpContext) {
    const schoolId = session.get('schoolId')
    const data = await request.validateUsing(updateSectionValidator)

    const section = await UpdateSection.handle({
      sectionId: params.id,
      schoolId,
      data,
    })

    session.flash('success', 'Section updated successfully')
    return response.redirect().toRoute('academics.classes.show', { id: section.classId })
  }

  async destroy({ params, response, session }: HttpContext) {
    const schoolId = session.get('schoolId')
    const section = await GetSection.handle({
      sectionId: params.id,
      schoolId,
    })

    const classId = section.classId

    await DeleteSection.handle({
      sectionId: params.id,
      schoolId,
    })

    session.flash('success', 'Section deleted successfully')
    return response.redirect().toRoute('academics.classes.show', { id: classId })
  }
}

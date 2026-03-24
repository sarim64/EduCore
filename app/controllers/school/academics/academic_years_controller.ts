import ListAcademicYears from '#actions/school/academics/year/list_academic_years'
import GetAcademicYear from '#actions/school/academics/year/get_academic_year'
import StoreAcademicYear from '#actions/school/academics/year/store_academic_year'
import UpdateAcademicYear from '#actions/school/academics/year/update_academic_year'
import DeleteAcademicYear from '#actions/school/academics/year/delete_academic_year'
import SetCurrentAcademicYear from '#actions/school/academics/year/set_current_academic_year'
import { createAcademicYearValidator, updateAcademicYearValidator } from '#validators/academic_year'
import type { HttpContext } from '@adonisjs/core/http'

export default class AcademicYearsController {
  async index({ session, inertia }: HttpContext) {
    const schoolId = session.get('schoolId')
    const academicYears = await ListAcademicYears.handle({ schoolId })

    return inertia.render('school/academics/academic-years/index', { academicYears })
  }

  async create({ inertia }: HttpContext) {
    return inertia.render('school/academics/academic-years/create')
  }

  async store({ request, response, session }: HttpContext) {
    const schoolId = session.get('schoolId')
    const data = await request.validateUsing(createAcademicYearValidator, {
      meta: { schoolId },
    })

    await StoreAcademicYear.handle({ schoolId, data })

    session.flash('success', 'Academic year created successfully')
    return response.redirect().toRoute('academics.years.index')
  }

  async edit({ params, session, inertia }: HttpContext) {
    const schoolId = session.get('schoolId')
    const academicYear = await GetAcademicYear.handle({
      academicYearId: params.id,
      schoolId,
    })

    return inertia.render('school/academics/academic-years/edit', { academicYear })
  }

  async update({ params, request, response, session }: HttpContext) {
    const schoolId = session.get('schoolId')
    const data = await request.validateUsing(updateAcademicYearValidator, {
      meta: { schoolId, academicYearId: params.id },
    })

    await UpdateAcademicYear.handle({
      academicYearId: params.id,
      schoolId,
      data,
    })

    session.flash('success', 'Academic year updated successfully')
    return response.redirect().toRoute('academics.years.index')
  }

  async destroy({ params, response, session }: HttpContext) {
    const schoolId = session.get('schoolId')

    await DeleteAcademicYear.handle({
      academicYearId: params.id,
      schoolId,
    })

    session.flash('success', 'Academic year deleted successfully')
    return response.redirect().toRoute('academics.years.index')
  }

  async setCurrent({ params, response, session }: HttpContext) {
    const schoolId = session.get('schoolId')

    await SetCurrentAcademicYear.handle({
      academicYearId: params.id,
      schoolId,
    })

    session.flash('success', 'Current academic year updated')
    return response.redirect().toRoute('academics.years.index')
  }
}

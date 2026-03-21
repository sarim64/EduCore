import type { HttpContext } from '@adonisjs/core/http'
import School from '#models/school'
import SchoolDto from '#dtos/school'
import { inject } from '@adonisjs/core'
import StoreSchool from '#actions/superadmin/store_school'
import UpdateSchool from '#actions/superadmin/update_school'
import DeleteSchool from '#actions/superadmin/delete_school'
import ListSchools from '#actions/superadmin/list_schools'
import GetSchool from '#actions/superadmin/get_school'
import { adminCreateSchoolValidator, adminUpdateSchoolValidator } from '#validators/admin'

export default class SchoolsController {
  async index({ inertia }: HttpContext) {
    const schools = await ListSchools.handle()

    return inertia.render('superadmin/schools/index', {
      schools: SchoolDto.fromArray(schools),
    })
  }

  async create({ inertia }: HttpContext) {
    return inertia.render('superadmin/schools/create')
  }

  @inject()
  async store({ request, response, session, superAdmin }: HttpContext, action: StoreSchool) {
    const data = await request.validateUsing(adminCreateSchoolValidator)

    await action.handle({
      data,
      superAdmin: superAdmin!,
    })

    session.flash('success', 'School created successfully')
    return response.redirect().toRoute('admin.schools.index')
  }

  async show({ params, inertia }: HttpContext) {
    const school = await GetSchool.handle({ id: params.id })

    return inertia.render('superadmin/schools/show', {
      school: new SchoolDto(school),
    })
  }

  async edit({ params, inertia }: HttpContext) {
    const school = await School.findOrFail(params.id)

    return inertia.render('superadmin/schools/edit', {
      school: new SchoolDto(school),
    })
  }

  @inject()
  async update(
    { params, request, response, session, superAdmin }: HttpContext,
    action: UpdateSchool
  ) {
    const data = await request.validateUsing(adminUpdateSchoolValidator)
    const school = await School.findOrFail(params.id)

    await action.handle({
      school,
      data,
      superAdmin: superAdmin!,
    })

    session.flash('success', 'School updated successfully')
    return response.redirect().toRoute('admin.schools.index')
  }

  @inject()
  async destroy({ params, response, session, superAdmin }: HttpContext, action: DeleteSchool) {
    const school = await School.findOrFail(params.id)

    await action.handle({
      school,
      superAdmin: superAdmin!,
    })

    session.flash('success', 'School deleted successfully')
    return response.redirect().toRoute('admin.schools.index')
  }

  /**
   * Switch to a school context (super admin only)
   * This allows super admins to access school-specific features
   */
  async enterSchool({ params, response, session }: HttpContext) {
    const school = await School.findOrFail(params.id)

    // Set the school context in session
    session.put('schoolId', school.id)
    session.flash('success', `Switched to ${school.name}`)

    // Redirect to school dashboard
    return response.redirect().toPath('/')
  }

  /**
   * Exit school context and return to admin panel
   */
  async exitSchool({ response, session }: HttpContext) {
    session.forget('schoolId')
    session.flash('success', 'Exited school context')

    return response.redirect().toRoute('admin.dashboard')
  }
}

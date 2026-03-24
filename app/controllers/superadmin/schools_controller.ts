import type { HttpContext } from '@adonisjs/core/http'
import School from '#models/school'
import SchoolDto from '#dtos/school'
import SchoolSubscriptionDto from '#dtos/school_subscription'
import { inject } from '@adonisjs/core'
import StoreSchool from '#actions/superadmin/store_school'
import UpdateSchool from '#actions/superadmin/update_school'
import DeleteSchool from '#actions/superadmin/delete_school'
import ListSchools from '#actions/superadmin/list_schools'
import GetSchool from '#actions/superadmin/get_school'
import ListPlans from '#actions/superadmin/subscription/list_plans'
import SubscriptionPlanDto from '#dtos/subscription_plan'
import SuspendSchool from '#actions/superadmin/suspend_school'
import ActivateSchool from '#actions/superadmin/activate_school'
import ExtendSubscription from '#actions/superadmin/subscription/extend_subscription'
import { adminCreateSchoolValidator, adminUpdateSchoolValidator } from '#validators/admin'
import { extendSubscriptionValidator } from '#validators/subscription'

export default class SchoolsController {
  async index({ inertia }: HttpContext) {
    const [schools, plans] = await Promise.all([ListSchools.handle(), ListPlans.handle()])

    return inertia.render('superadmin/schools/index', {
      schools,
      plans: SubscriptionPlanDto.fromArray(plans),
    })
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
    const { school, studentsCount, primaryAdmin } = await GetSchool.handle({ id: params.id })

    return inertia.render('superadmin/schools/show', {
      school: new SchoolDto(school),
      subscriptions: SchoolSubscriptionDto.fromArray(school.subscriptions),
      studentsCount,
      primaryAdmin,
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
    return response.redirect().toRoute('admin.schools.show', { id: params.id })
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

  @inject()
  async suspend({ params, response, session, superAdmin }: HttpContext, action: SuspendSchool) {
    const school = await School.findOrFail(params.id)

    await action.handle({ school, superAdmin: superAdmin! })

    session.flash('success', `${school.name} has been suspended`)
    return response.redirect().toRoute('admin.schools.show', { id: params.id })
  }

  @inject()
  async activate({ params, response, session, superAdmin }: HttpContext, action: ActivateSchool) {
    const school = await School.findOrFail(params.id)

    await action.handle({ school, superAdmin: superAdmin! })

    session.flash('success', `${school.name} has been activated`)
    return response.redirect().toRoute('admin.schools.show', { id: params.id })
  }

  @inject()
  async extend(
    { params, request, response, session }: HttpContext,
    action: ExtendSubscription
  ) {
    const data = await request.validateUsing(extendSubscriptionValidator)
    const school = await School.findOrFail(params.id)

    await action.handle({ school, data })

    session.flash('success', 'Subscription extended successfully')
    return response.redirect().toRoute('admin.schools.show', { id: params.id })
  }

  async enterSchool({ params, response, session }: HttpContext) {
    const school = await School.findOrFail(params.id)

    session.put('schoolId', school.id)
    session.flash('success', `Switched to ${school.name}`)

    return response.redirect().toRoute('dashboard')
  }

  async exitSchool({ response, session }: HttpContext) {
    session.forget('schoolId')
    session.flash('success', 'Exited school context')

    return response.redirect().toRoute('admin.dashboard')
  }
}

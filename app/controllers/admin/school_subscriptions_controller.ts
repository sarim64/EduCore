import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import School from '#models/school'
import SchoolDto from '#dtos/school'
import SubscriptionPlanDto from '#dtos/subscription_plan'
import SchoolSubscriptionDto from '#dtos/school_subscription'
import ListPlans from '#actions/superadmin/subscription/list_plans'
import GetSchoolSubscription from '#actions/superadmin/subscription/get_school_subscription'
import AssignSubscription from '#actions/superadmin/subscription/assign_subscription'
import { assignSubscriptionValidator } from '#validators/subscription'

export default class SchoolSubscriptionsController {
  async show({ params, inertia }: HttpContext) {
    const school = await School.findOrFail(params.schoolId)
    const subscription = await GetSchoolSubscription.handle({ schoolId: school.id })
    const plans = await ListPlans.handle()

    return inertia.render('superadmin/schools/subscription', {
      school: new SchoolDto(school),
      subscription: subscription ? new SchoolSubscriptionDto(subscription) : null,
      plans: SubscriptionPlanDto.fromArray(plans),
    })
  }

  @inject()
  async assign({ params, request, response, session }: HttpContext, action: AssignSubscription) {
    const data = await request.validateUsing(assignSubscriptionValidator)
    const school = await School.findOrFail(params.schoolId)

    try {
      await action.handle({ school, data })
      session.flash('success', 'Subscription assigned successfully')
    } catch (error) {
      session.flash('error', error.message)
    }

    return response.redirect().toRoute('admin.schools.subscription.show', { schoolId: school.id })
  }

  @inject()
  async update({ params, request, response, session }: HttpContext, action: AssignSubscription) {
    const data = await request.validateUsing(assignSubscriptionValidator)
    const school = await School.findOrFail(params.schoolId)

    try {
      await action.handle({ school, data })
      session.flash('success', 'Subscription updated successfully')
    } catch (error) {
      session.flash('error', error.message)
    }

    return response.redirect().toRoute('admin.schools.subscription.show', { schoolId: school.id })
  }
}

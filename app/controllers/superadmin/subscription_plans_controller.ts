import type { HttpContext } from '@adonisjs/core/http'
import ListPlans from '#actions/superadmin/subscription/list_plans'
import GetPlan from '#actions/superadmin/subscription/get_plan'
import StorePlan from '#actions/superadmin/subscription/store_plan'
import UpdatePlan from '#actions/superadmin/subscription/update_plan'
import DeletePlan from '#actions/superadmin/subscription/delete_plan'
import ListSchoolSubscriptions from '#actions/superadmin/subscription/list_school_subscriptions'
import SubscriptionPlanDto from '#dtos/subscription_plan'
import SchoolSubscriptionDto from '#dtos/school_subscription'
import { createPlanValidator, updatePlanValidator } from '#validators/subscription'

export default class SubscriptionPlansController {
  async index({ inertia, request }: HttpContext) {
    const page = request.input('page', 1)
    const [plans, { paginator, planCounts }] = await Promise.all([
      ListPlans.handle(),
      ListSchoolSubscriptions.handle({ page }),
    ])

    return inertia.render('superadmin/subscriptions/index', {
      plans: SubscriptionPlanDto.fromArray(plans),
      subscriptions: SchoolSubscriptionDto.fromArray(paginator.all()),
      planCounts,
    })
  }

  async store({ request, response, session }: HttpContext) {
    const data = await request.validateUsing(createPlanValidator)

    try {
      await StorePlan.handle({ data })
      session.flash('success', 'Subscription plan created successfully')
      return response.redirect().toRoute('admin.subscriptions.index')
    } catch (error) {
      session.flash('error', error.message)
      return response.redirect().back()
    }
  }

  async update({ params, request, response, session }: HttpContext) {
    const data = await request.validateUsing(updatePlanValidator)
    const plan = await GetPlan.handle({ id: params.id })

    try {
      await UpdatePlan.handle({ plan, data })
      session.flash('success', 'Subscription plan updated successfully')
      return response.redirect().toRoute('admin.subscriptions.index')
    } catch (error) {
      session.flash('error', error.message)
      return response.redirect().back()
    }
  }

  async destroy({ params, response, session }: HttpContext) {
    const plan = await GetPlan.handle({ id: params.id })

    try {
      await DeletePlan.handle({ plan })
      session.flash('success', 'Subscription plan deleted successfully')
    } catch (error) {
      session.flash('error', error.message)
    }

    return response.redirect().toRoute('admin.subscriptions.index')
  }
}

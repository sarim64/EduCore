import type { HttpContext } from '@adonisjs/core/http'
import ListPlans from '#actions/superadmin/subscription/list_plans'
import GetPlan from '#actions/superadmin/subscription/get_plan'
import StorePlan from '#actions/superadmin/subscription/store_plan'
import UpdatePlan from '#actions/superadmin/subscription/update_plan'
import DeletePlan from '#actions/superadmin/subscription/delete_plan'
import SubscriptionPlanDto from '#dtos/subscription_plan'
import { createPlanValidator, updatePlanValidator } from '#validators/subscription'

export default class SubscriptionPlansController {
  async index({ inertia }: HttpContext) {
    const plans = await ListPlans.handle()

    return inertia.render('superadmin/plans/index', {
      plans: SubscriptionPlanDto.fromArray(plans),
    })
  }

  async create({ inertia }: HttpContext) {
    return inertia.render('superadmin/plans/create')
  }

  async store({ request, response, session }: HttpContext) {
    const data = await request.validateUsing(createPlanValidator)

    try {
      await StorePlan.handle({ data })
      session.flash('success', 'Subscription plan created successfully')
      return response.redirect().toRoute('admin.plans.index')
    } catch (error) {
      session.flash('error', error.message)
      return response.redirect().back()
    }
  }

  async edit({ params, inertia }: HttpContext) {
    const plan = await GetPlan.handle({ id: params.id })

    return inertia.render('superadmin/plans/edit', {
      plan: new SubscriptionPlanDto(plan),
    })
  }

  async update({ params, request, response, session }: HttpContext) {
    const data = await request.validateUsing(updatePlanValidator)
    const plan = await GetPlan.handle({ id: params.id })

    try {
      await UpdatePlan.handle({ plan, data })
      session.flash('success', 'Subscription plan updated successfully')
      return response.redirect().toRoute('admin.plans.index')
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

    return response.redirect().toRoute('admin.plans.index')
  }
}

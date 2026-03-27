import FeeCategoryDto from '#dtos/fee_category'
import ListFeeCategories from '#actions/school/fees/fee_category/list_fee_categories'
import GetFeeCategory from '#actions/school/fees/fee_category/get_fee_category'
import StoreFeeCategory from '#actions/school/fees/fee_category/store_fee_category'
import UpdateFeeCategory from '#actions/school/fees/fee_category/update_fee_category'
import DeleteFeeCategory from '#actions/school/fees/fee_category/delete_fee_category'
import { createFeeCategoryValidator, updateFeeCategoryValidator } from '#validators/fee_category'
import type { HttpContext } from '@adonisjs/core/http'

export default class FeeCategoriesController {
  async index({ session, inertia }: HttpContext) {
    const schoolId = session.get('schoolId')
    const categories = await ListFeeCategories.handle({ schoolId, includeInactive: true })

    return inertia.render('school/fees/categories/index', {
      categories: FeeCategoryDto.fromArray(categories),
    })
  }

  async create({ inertia }: HttpContext) {
    return inertia.render('school/fees/categories/create')
  }

  async store(ctx: HttpContext) {
    const { request, response, session, auth } = ctx
    const schoolId = session.get('schoolId')
    const data = await request.validateUsing(createFeeCategoryValidator)

    await StoreFeeCategory.handle({ schoolId, data, ctx, userId: auth.user!.id })

    session.flash('success', 'Fee category created successfully')
    return response.redirect().toRoute('fees.categories.index')
  }

  async edit({ params, session, inertia }: HttpContext) {
    const schoolId = session.get('schoolId')
    const category = await GetFeeCategory.handle({ id: params.id, schoolId })

    return inertia.render('school/fees/categories/edit', {
      category: new FeeCategoryDto(category),
    })
  }

  async update(ctx: HttpContext) {
    const { params, request, response, session, auth } = ctx
    const schoolId = session.get('schoolId')
    const data = await request.validateUsing(updateFeeCategoryValidator)

    await UpdateFeeCategory.handle({ id: params.id, schoolId, data, ctx, userId: auth.user!.id })

    session.flash('success', 'Fee category updated successfully')
    return response.redirect().toRoute('fees.categories.index')
  }

  async destroy(ctx: HttpContext) {
    const { params, response, session, auth } = ctx
    const schoolId = session.get('schoolId')

    try {
      await DeleteFeeCategory.handle({ id: params.id, schoolId, ctx, userId: auth.user!.id })
      session.flash('success', 'Fee category deleted successfully')
    } catch (error) {
      session.flash('error', error.message)
      return response.redirect().back()
    }

    return response.redirect().toRoute('fees.categories.index')
  }
}

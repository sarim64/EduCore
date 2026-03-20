import FeeCategoryDto from '#dtos/fee_category'
import ListFeeCategories from '#actions/fees/fee_category/list_fee_categories'
import GetFeeCategory from '#actions/fees/fee_category/get_fee_category'
import StoreFeeCategory from '#actions/fees/fee_category/store_fee_category'
import UpdateFeeCategory from '#actions/fees/fee_category/update_fee_category'
import DeleteFeeCategory from '#actions/fees/fee_category/delete_fee_category'
import { createFeeCategoryValidator, updateFeeCategoryValidator } from '#validators/fee_category'
import type { HttpContext } from '@adonisjs/core/http'

export default class FeeCategoriesController {
  async index({ session, inertia }: HttpContext) {
    const schoolId = session.get('schoolId')
    const categories = await ListFeeCategories.handle({ schoolId, includeInactive: true })

    return inertia.render('fees/categories/index', {
      categories: FeeCategoryDto.fromArray(categories),
    })
  }

  async create({ inertia }: HttpContext) {
    return inertia.render('fees/categories/create')
  }

  async store({ request, response, session }: HttpContext) {
    const schoolId = session.get('schoolId')
    const data = await request.validateUsing(createFeeCategoryValidator)

    await StoreFeeCategory.handle({ schoolId, data })

    session.flash('success', 'Fee category created successfully')
    return response.redirect().toRoute('fees.categories.index')
  }

  async edit({ params, session, inertia }: HttpContext) {
    const schoolId = session.get('schoolId')
    const category = await GetFeeCategory.handle({ id: params.id, schoolId })

    return inertia.render('fees/categories/edit', {
      category: new FeeCategoryDto(category),
    })
  }

  async update({ params, request, response, session }: HttpContext) {
    const schoolId = session.get('schoolId')
    const data = await request.validateUsing(updateFeeCategoryValidator)

    await UpdateFeeCategory.handle({ id: params.id, schoolId, data })

    session.flash('success', 'Fee category updated successfully')
    return response.redirect().toRoute('fees.categories.index')
  }

  async destroy({ params, response, session }: HttpContext) {
    const schoolId = session.get('schoolId')

    try {
      await DeleteFeeCategory.handle({ id: params.id, schoolId })
      session.flash('success', 'Fee category deleted successfully')
    } catch (error) {
      session.flash('error', error.message)
      return response.redirect().back()
    }

    return response.redirect().toRoute('fees.categories.index')
  }
}

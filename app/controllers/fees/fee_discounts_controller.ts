import FeeDiscountDto from '#dtos/fee_discount'
import FeeCategoryDto from '#dtos/fee_category'
import ListFeeDiscounts from '#actions/fees/fee_discount/list_fee_discounts'
import GetFeeDiscount from '#actions/fees/fee_discount/get_fee_discount'
import StoreFeeDiscount from '#actions/fees/fee_discount/store_fee_discount'
import UpdateFeeDiscount from '#actions/fees/fee_discount/update_fee_discount'
import DeleteFeeDiscount from '#actions/fees/fee_discount/delete_fee_discount'
import ListFeeCategories from '#actions/fees/fee_category/list_fee_categories'
import { createFeeDiscountValidator, updateFeeDiscountValidator } from '#validators/fee_discount'
import type { HttpContext } from '@adonisjs/core/http'

export default class FeeDiscountsController {
  async index({ session, inertia }: HttpContext) {
    const schoolId = session.get('schoolId')
    const discounts = await ListFeeDiscounts.handle({ schoolId, includeInactive: true })

    return inertia.render('fees/discounts/index', {
      discounts: FeeDiscountDto.fromArray(discounts),
    })
  }

  async create({ session, inertia }: HttpContext) {
    const schoolId = session.get('schoolId')
    const categories = await ListFeeCategories.handle({ schoolId })

    return inertia.render('fees/discounts/create', {
      categories: FeeCategoryDto.fromArray(categories),
    })
  }

  async store({ request, response, session }: HttpContext) {
    const schoolId = session.get('schoolId')
    const data = await request.validateUsing(createFeeDiscountValidator)

    await StoreFeeDiscount.handle({ schoolId, data })

    session.flash('success', 'Fee discount created successfully')
    return response.redirect().toRoute('fees.discounts.index')
  }

  async edit({ params, session, inertia }: HttpContext) {
    const schoolId = session.get('schoolId')
    const discount = await GetFeeDiscount.handle({ id: params.id, schoolId })
    const categories = await ListFeeCategories.handle({ schoolId })

    return inertia.render('fees/discounts/edit', {
      discount: new FeeDiscountDto(discount),
      categories: FeeCategoryDto.fromArray(categories),
    })
  }

  async update({ params, request, response, session }: HttpContext) {
    const schoolId = session.get('schoolId')
    const data = await request.validateUsing(updateFeeDiscountValidator)

    await UpdateFeeDiscount.handle({ id: params.id, schoolId, data })

    session.flash('success', 'Fee discount updated successfully')
    return response.redirect().toRoute('fees.discounts.index')
  }

  async destroy({ params, response, session }: HttpContext) {
    const schoolId = session.get('schoolId')

    try {
      await DeleteFeeDiscount.handle({ id: params.id, schoolId })
      session.flash('success', 'Fee discount deleted successfully')
    } catch (error) {
      session.flash('error', error.message)
      return response.redirect().back()
    }

    return response.redirect().toRoute('fees.discounts.index')
  }
}

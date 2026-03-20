import FeeStructureDto from '#dtos/fee_structure'
import FeeCategoryDto from '#dtos/fee_category'
import AcademicYearDto from '#dtos/academic_year'
import SchoolClassDto from '#dtos/school_class'
import ListFeeStructures from '#actions/fees/fee_structure/list_fee_structures'
import GetFeeStructure from '#actions/fees/fee_structure/get_fee_structure'
import StoreFeeStructure from '#actions/fees/fee_structure/store_fee_structure'
import UpdateFeeStructure from '#actions/fees/fee_structure/update_fee_structure'
import DeleteFeeStructure from '#actions/fees/fee_structure/delete_fee_structure'
import BulkCreateFeeStructures from '#actions/fees/fee_structure/bulk_create_fee_structures'
import ListFeeCategories from '#actions/fees/fee_category/list_fee_categories'
import ListAcademicYears from '#actions/academics/year/list_academic_years'
import ListClasses from '#actions/academics/class/list_classes'
import {
  createFeeStructureValidator,
  updateFeeStructureValidator,
  bulkCreateFeeStructureValidator,
} from '#validators/fee_structure'
import type { HttpContext } from '@adonisjs/core/http'

export default class FeeStructuresController {
  async index({ session, request, inertia }: HttpContext) {
    const schoolId = session.get('schoolId')
    const academicYearId = request.input('academicYearId')
    const classId = request.input('classId')

    const [structures, academicYears, classes] = await Promise.all([
      ListFeeStructures.handle({
        schoolId,
        academicYearId,
        classId,
        includeInactive: true,
      }),
      ListAcademicYears.handle({ schoolId }),
      ListClasses.handle({ schoolId }),
    ])

    return inertia.render('fees/structures/index', {
      structures: FeeStructureDto.fromArray(structures),
      academicYears: AcademicYearDto.fromArray(academicYears),
      classes: SchoolClassDto.fromArray(classes),
      filters: { academicYearId, classId },
    })
  }

  async create({ session, inertia }: HttpContext) {
    const schoolId = session.get('schoolId')

    const [categories, academicYears, classes] = await Promise.all([
      ListFeeCategories.handle({ schoolId }),
      ListAcademicYears.handle({ schoolId }),
      ListClasses.handle({ schoolId }),
    ])

    return inertia.render('fees/structures/create', {
      categories: FeeCategoryDto.fromArray(categories),
      academicYears: AcademicYearDto.fromArray(academicYears),
      classes: SchoolClassDto.fromArray(classes),
    })
  }

  async store({ request, response, session }: HttpContext) {
    const schoolId = session.get('schoolId')
    const data = await request.validateUsing(createFeeStructureValidator)

    await StoreFeeStructure.handle({ schoolId, data })

    session.flash('success', 'Fee structure created successfully')
    return response.redirect().toRoute('fees.structures.index')
  }

  async bulkCreate({ request, response, session }: HttpContext) {
    const schoolId = session.get('schoolId')
    const data = await request.validateUsing(bulkCreateFeeStructureValidator)

    const structures = await BulkCreateFeeStructures.handle({ schoolId, data })

    session.flash('success', `${structures.length} fee structures created/updated successfully`)
    return response.redirect().toRoute('fees.structures.index')
  }

  async edit({ params, session, inertia }: HttpContext) {
    const schoolId = session.get('schoolId')

    const [structure, categories, academicYears, classes] = await Promise.all([
      GetFeeStructure.handle({ id: params.id, schoolId }),
      ListFeeCategories.handle({ schoolId }),
      ListAcademicYears.handle({ schoolId }),
      ListClasses.handle({ schoolId }),
    ])

    return inertia.render('fees/structures/edit', {
      structure: new FeeStructureDto(structure),
      categories: FeeCategoryDto.fromArray(categories),
      academicYears: AcademicYearDto.fromArray(academicYears),
      classes: SchoolClassDto.fromArray(classes),
    })
  }

  async update({ params, request, response, session }: HttpContext) {
    const schoolId = session.get('schoolId')
    const data = await request.validateUsing(updateFeeStructureValidator)

    await UpdateFeeStructure.handle({ id: params.id, schoolId, data })

    session.flash('success', 'Fee structure updated successfully')
    return response.redirect().toRoute('fees.structures.index')
  }

  async destroy({ params, response, session }: HttpContext) {
    const schoolId = session.get('schoolId')

    try {
      await DeleteFeeStructure.handle({ id: params.id, schoolId })
      session.flash('success', 'Fee structure deleted successfully')
    } catch (error) {
      session.flash('error', error.message)
      return response.redirect().back()
    }

    return response.redirect().toRoute('fees.structures.index')
  }
}

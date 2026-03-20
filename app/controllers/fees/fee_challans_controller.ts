import FeeChallanDto from '#dtos/fee_challan'
import AcademicYearDto from '#dtos/academic_year'
import SchoolClassDto from '#dtos/school_class'
import StudentDto from '#dtos/student'
import ListChallans from '#actions/fees/fee_challan/list_challans'
import GetChallan from '#actions/fees/fee_challan/get_challan'
import GenerateChallan from '#actions/fees/fee_challan/generate_challan'
import BulkGenerateChallans from '#actions/fees/fee_challan/bulk_generate_challans'
import ApplyLateFees from '#actions/fees/fee_challan/apply_late_fees'
import CancelChallan from '#actions/fees/fee_challan/cancel_challan'
import ListAcademicYears from '#actions/academics/year/list_academic_years'
import ListClasses from '#actions/academics/class/list_classes'
import ListStudents from '#actions/students/student/list_students'
import ChallanStatus from '#enums/challan_status'
import {
  generateChallanValidator,
  bulkGenerateChallanValidator,
  applyLateFeeValidator,
} from '#validators/fee_challan'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'

export default class FeeChallansController {
  async index({ session, request, inertia }: HttpContext) {
    const schoolId = session.get('schoolId')
    const page = request.input('page', 1)
    const academicYearId = request.input('academicYearId')
    const classId = request.input('classId')
    const status = request.input('status') as ChallanStatus | undefined

    const [challans, academicYears, classes] = await Promise.all([
      ListChallans.handle({
        schoolId,
        academicYearId,
        classId,
        status,
        page,
      }),
      ListAcademicYears.handle({ schoolId }),
      ListClasses.handle({ schoolId }),
    ])

    return inertia.render('fees/challans/index', {
      challans: {
        data: challans.all().map((c) => new FeeChallanDto(c)),
        meta: challans.getMeta(),
      },
      academicYears: AcademicYearDto.fromArray(academicYears),
      classes: SchoolClassDto.fromArray(classes),
      filters: { academicYearId, classId, status },
      statuses: Object.values(ChallanStatus),
    })
  }

  async create({ session, inertia }: HttpContext) {
    const schoolId = session.get('schoolId')

    const [academicYears, classes, students] = await Promise.all([
      ListAcademicYears.handle({ schoolId }),
      ListClasses.handle({ schoolId }),
      ListStudents.handle({ schoolId }),
    ])

    return inertia.render('fees/challans/create', {
      academicYears: AcademicYearDto.fromArray(academicYears),
      classes: SchoolClassDto.fromArray(classes),
      students: StudentDto.fromArray(students),
    })
  }

  async store({ request, response, session, auth }: HttpContext) {
    const schoolId = session.get('schoolId')
    const userId = auth.user!.id
    const data = await request.validateUsing(generateChallanValidator)

    try {
      await GenerateChallan.handle({ schoolId, userId, data })
      session.flash('success', 'Fee challan generated successfully')
    } catch (error) {
      session.flash('error', error.message)
      return response.redirect().back()
    }

    return response.redirect().toRoute('fees.challans.index')
  }

  async bulkCreate({ session, inertia }: HttpContext) {
    const schoolId = session.get('schoolId')

    const [academicYears, classes] = await Promise.all([
      ListAcademicYears.handle({ schoolId }),
      ListClasses.handle({ schoolId }),
    ])

    return inertia.render('fees/challans/bulk-create', {
      academicYears: AcademicYearDto.fromArray(academicYears),
      classes: SchoolClassDto.fromArray(classes),
    })
  }

  async bulkStore({ request, response, session, auth }: HttpContext) {
    const schoolId = session.get('schoolId')
    const userId = auth.user!.id
    const data = await request.validateUsing(bulkGenerateChallanValidator)

    try {
      const result = await BulkGenerateChallans.handle({ schoolId, userId, data })
      session.flash(
        'success',
        `Generated ${result.generated} challans (${result.skipped} skipped - already exist)`
      )
    } catch (error) {
      session.flash('error', error.message)
      return response.redirect().back()
    }

    return response.redirect().toRoute('fees.challans.index')
  }

  async show({ params, session, inertia }: HttpContext) {
    const schoolId = session.get('schoolId')
    const challan = await GetChallan.handle({ id: params.id, schoolId })

    return inertia.render('fees/challans/show', {
      challan: new FeeChallanDto(challan),
    })
  }

  async applyLateFees({ request, response, session }: HttpContext) {
    const schoolId = session.get('schoolId')
    const data = await request.validateUsing(applyLateFeeValidator)

    try {
      const result = await ApplyLateFees.handle({
        schoolId,
        challanIds: data.challanIds,
        asOfDate: data.asOfDate ? DateTime.fromJSDate(data.asOfDate) : undefined,
      })
      session.flash('success', `Applied late fees to ${result.updated} challans`)
    } catch (error) {
      session.flash('error', error.message)
      return response.redirect().back()
    }

    return response.redirect().toRoute('fees.challans.index')
  }

  async cancel({ params, response, session }: HttpContext) {
    const schoolId = session.get('schoolId')

    try {
      await CancelChallan.handle({ id: params.id, schoolId })
      session.flash('success', 'Challan cancelled successfully')
    } catch (error) {
      session.flash('error', error.message)
    }

    return response.redirect().back()
  }
}

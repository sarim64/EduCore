import StudentDiscountDto from '#dtos/student_discount'
import FeeDiscountDto from '#dtos/fee_discount'
import AcademicYearDto from '#dtos/academic_year'
import StudentDto from '#dtos/student'
import ListStudentDiscounts from '#actions/school/fees/student_discount/list_student_discounts'
import AssignStudentDiscount from '#actions/school/fees/student_discount/assign_student_discount'
import BulkAssignStudentDiscount from '#actions/school/fees/student_discount/bulk_assign_student_discount'
import RemoveStudentDiscount from '#actions/school/fees/student_discount/remove_student_discount'
import ListFeeDiscounts from '#actions/school/fees/fee_discount/list_fee_discounts'
import ListAcademicYears from '#actions/school/academics/year/list_academic_years'
import ListStudents from '#actions/school/students/student/list_students'
import {
  createStudentDiscountValidator,
  bulkAssignStudentDiscountValidator,
} from '#validators/student_discount'
import type { HttpContext } from '@adonisjs/core/http'

export default class StudentDiscountsController {
  async index({ session, request, inertia }: HttpContext) {
    const schoolId = session.get('schoolId')
    const academicYearId = request.input('academicYearId')
    const studentId = request.input('studentId')

    const [assignments, academicYears] = await Promise.all([
      ListStudentDiscounts.handle({
        schoolId,
        academicYearId,
        studentId,
        includeInactive: true,
      }),
      ListAcademicYears.handle({ schoolId }),
    ])

    return inertia.render('school/fees/student-discounts/index', {
      assignments: StudentDiscountDto.fromArray(assignments),
      academicYears: AcademicYearDto.fromArray(academicYears),
      filters: { academicYearId, studentId },
    })
  }

  async create({ session, inertia }: HttpContext) {
    const schoolId = session.get('schoolId')

    const [discounts, academicYears, students] = await Promise.all([
      ListFeeDiscounts.handle({ schoolId }),
      ListAcademicYears.handle({ schoolId }),
      ListStudents.handle({ schoolId }),
    ])

    return inertia.render('school/fees/student-discounts/create', {
      discounts: FeeDiscountDto.fromArray(discounts),
      academicYears: AcademicYearDto.fromArray(academicYears),
      students: StudentDto.fromArray(students),
    })
  }

  async store({ request, response, session, auth }: HttpContext) {
    const schoolId = session.get('schoolId')
    const userId = auth.user!.id
    const data = await request.validateUsing(createStudentDiscountValidator)

    try {
      await AssignStudentDiscount.handle({ schoolId, userId, data })
      session.flash('success', 'Discount assigned successfully')
    } catch (error) {
      session.flash('error', error.message)
      return response.redirect().back()
    }

    return response.redirect().toRoute('fees.student-discounts.index')
  }

  async bulkStore({ request, response, session, auth }: HttpContext) {
    const schoolId = session.get('schoolId')
    const userId = auth.user!.id
    const data = await request.validateUsing(bulkAssignStudentDiscountValidator)

    try {
      const assignments = await BulkAssignStudentDiscount.handle({ schoolId, userId, data })
      session.flash('success', `Discount assigned to ${assignments.length} students`)
    } catch (error) {
      session.flash('error', error.message)
      return response.redirect().back()
    }

    return response.redirect().toRoute('fees.student-discounts.index')
  }

  async destroy({ params, response, session }: HttpContext) {
    const schoolId = session.get('schoolId')

    try {
      await RemoveStudentDiscount.handle({ id: params.id, schoolId })
      session.flash('success', 'Discount assignment removed')
    } catch (error) {
      session.flash('error', error.message)
    }

    return response.redirect().back()
  }
}

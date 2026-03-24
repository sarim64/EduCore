import FeeChallanDto from '#dtos/fee_challan'
import FeePaymentDto from '#dtos/fee_payment'
import StudentDto from '#dtos/student'
import AcademicYearDto from '#dtos/academic_year'
import GetStudentLedger from '#actions/school/fees/fee_challan/get_student_ledger'
import ListAcademicYears from '#actions/school/academics/year/list_academic_years'
import type { HttpContext } from '@adonisjs/core/http'

export default class FeeLedgerController {
  async show({ params, session, request, inertia }: HttpContext) {
    const schoolId = session.get('schoolId')
    const academicYearId = request.input('academicYearId')

    const [ledger, academicYears] = await Promise.all([
      GetStudentLedger.handle({
        studentId: params.studentId,
        schoolId,
        academicYearId,
      }),
      ListAcademicYears.handle({ schoolId }),
    ])

    return inertia.render('school/fees/ledger/show', {
      student: new StudentDto(ledger.student),
      challans: ledger.challans.map((c) => new FeeChallanDto(c)),
      payments: ledger.payments.map((p) => new FeePaymentDto(p)),
      summary: ledger.summary,
      academicYears: AcademicYearDto.fromArray(academicYears),
      filters: { academicYearId },
    })
  }
}

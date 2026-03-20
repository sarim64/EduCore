import FeePaymentDto from '#dtos/fee_payment'
import StudentDto from '#dtos/student'
import FeeChallanDto from '#dtos/fee_challan'
import AcademicYearDto from '#dtos/academic_year'
import SchoolClassDto from '#dtos/school_class'
import FeeCollectionReport from '#actions/fees/reports/fee_collection_report'
import DefaultersReport from '#actions/fees/reports/defaulters_report'
import ListAcademicYears from '#actions/academics/year/list_academic_years'
import ListClasses from '#actions/academics/class/list_classes'
import { DateTime } from 'luxon'
import type { HttpContext } from '@adonisjs/core/http'

export default class FeeReportsController {
  async collection({ session, request, inertia }: HttpContext) {
    const schoolId = session.get('schoolId')
    const academicYearId = request.input('academicYearId')
    const classId = request.input('classId')
    const startDate = request.input('startDate')
    const endDate = request.input('endDate')
    const groupBy = request.input('groupBy', 'day') as
      | 'day'
      | 'week'
      | 'month'
      | 'class'
      | 'paymentMethod'

    const [report, academicYears, classes] = await Promise.all([
      FeeCollectionReport.handle({
        schoolId,
        academicYearId,
        classId,
        startDate: startDate ? DateTime.fromISO(startDate) : DateTime.now().startOf('month'),
        endDate: endDate ? DateTime.fromISO(endDate) : DateTime.now(),
        groupBy,
      }),
      ListAcademicYears.handle({ schoolId }),
      ListClasses.handle({ schoolId }),
    ])

    return inertia.render('fees/reports/collection', {
      payments: report.payments.map((p) => new FeePaymentDto(p)),
      summary: report.summary,
      groupedData: report.groupedData,
      academicYears: AcademicYearDto.fromArray(academicYears),
      classes: SchoolClassDto.fromArray(classes),
      filters: {
        academicYearId,
        classId,
        startDate: startDate ?? DateTime.now().startOf('month').toISODate(),
        endDate: endDate ?? DateTime.now().toISODate(),
        groupBy,
      },
    })
  }

  async defaulters({ session, request, inertia }: HttpContext) {
    const schoolId = session.get('schoolId')
    const academicYearId = request.input('academicYearId')
    const classId = request.input('classId')
    const minOverdueMonths = Number(request.input('minOverdueMonths', 2))

    const [report, academicYears, classes] = await Promise.all([
      DefaultersReport.handle({
        schoolId,
        academicYearId,
        classId,
        minOverdueMonths,
      }),
      ListAcademicYears.handle({ schoolId }),
      ListClasses.handle({ schoolId }),
    ])

    // Map defaulters to DTOs
    const defaulters = report.defaulters.map((d) => ({
      student: new StudentDto(d.student),
      className: d.className,
      sectionName: d.sectionName,
      totalDue: d.totalDue,
      overdueMonths: d.overdueMonths,
      lastPaymentDate: d.lastPaymentDate?.toISODate() ?? null,
      challans: d.challans.map((c) => new FeeChallanDto(c)),
    }))

    return inertia.render('fees/reports/defaulters', {
      defaulters,
      summary: report.summary,
      academicYears: AcademicYearDto.fromArray(academicYears),
      classes: SchoolClassDto.fromArray(classes),
      filters: {
        academicYearId,
        classId,
        minOverdueMonths,
      },
    })
  }
}

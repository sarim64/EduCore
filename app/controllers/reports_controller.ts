import ReportsService from '#services/reports_service'
import AcademicYear from '#models/academic_year'
import type { HttpContext } from '@adonisjs/core/http'

export default class ReportsController {
  async index({ inertia }: HttpContext) {
    return inertia.render('reports/index')
  }

  async enrollment({ session, inertia, request }: HttpContext) {
    const schoolId = session.get('schoolId')
    const academicYearId = request.input('academicYearId')

    // Get all academic years for the filter dropdown
    const academicYears = await AcademicYear.query()
      .where('schoolId', schoolId)
      .orderBy('startDate', 'desc')

    const report = await ReportsService.getEnrollmentReport(schoolId, academicYearId)

    return inertia.render('reports/enrollment', {
      report,
      academicYears: academicYears.map((y) => ({
        id: y.id,
        name: y.name,
        isCurrent: y.isCurrent,
      })),
      selectedYearId: academicYearId || academicYears.find((y) => y.isCurrent)?.id,
    })
  }

  async staffDirectory({ session, inertia }: HttpContext) {
    const schoolId = session.get('schoolId')

    const report = await ReportsService.getStaffDirectory(schoolId)

    return inertia.render('reports/staff-directory', { report })
  }
}

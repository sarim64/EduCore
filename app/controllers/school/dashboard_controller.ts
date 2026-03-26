import type { HttpContext } from '@adonisjs/core/http'
import ResolveDashboardContext from '#actions/school/resolve_dashboard_context'
import DashboardService from '#services/dashboard_service'
import AccessControlService from '#services/access_control_service'
import Roles from '#enums/roles'

export default class DashboardController {
  async index({ auth, session, response, inertia }: HttpContext) {
    const user = auth.user!
    const schoolId = session.get('schoolId')

    const context = await new ResolveDashboardContext().handle(user.id, schoolId)

    if (context.kind === 'redirectToAdmin') {
      return response.redirect().toRoute('admin.dashboard')
    }

    if (context.kind === 'redirectToSelect') {
      session.forget('schoolId')
      return response.redirect().toRoute('schools.select')
    }

    if (context.kind === 'redirectToLogin') {
      session.forget('schoolId')
      return response.redirect().toRoute('login.show')
    }

    if (context.kind === 'teacher') {
      const stats = await DashboardService.getTeacherStats(context.schoolId, context.staffId)
      return inertia.render('school/dashboards/teacher', { stats })
    }

    const stats = await DashboardService.getSchoolAdminStats(context.schoolId)

    if (context.isSuperAdmin || context.roleId === Roles.SCHOOL_ADMIN) {
      const canSee = AccessControlService.getFullAccess()
      return inertia.render('school/dashboards/admin', { stats, canSee })
    }

    const canSee = await AccessControlService.getCanSeeForRole(context.schoolId, context.roleId!)
    return inertia.render('school/dashboards/admin', { stats, canSee })
  }
}

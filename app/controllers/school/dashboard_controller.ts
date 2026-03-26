import type { HttpContext } from '@adonisjs/core/http'
import SuperAdmin from '#models/super_admin'
import DashboardService from '#services/dashboard_service'
import Staff from '#models/staff_member'
import db from '@adonisjs/lucid/services/db'
import Roles from '#enums/roles'

export default class DashboardController {
  async index({ auth, session, response, inertia }: HttpContext) {
    const user = auth.user!
    const schoolId = session.get('schoolId')

    const superAdmin = await SuperAdmin.query()
      .where('userId', user.id)
      .whereNull('revokedAt')
      .first()

    if (superAdmin && !schoolId) {
      return response.redirect().toRoute('admin.dashboard')
    }

    if (!schoolId) {
      const membership = await db
        .from('school_users')
        .where('user_id', user.id)
        .count('* as total')
        .first()
      const membershipCount = Number(membership?.total ?? 0)

      return membershipCount > 0
        ? response.redirect().toRoute('schools.select')
        : response.redirect().toRoute('login.show')
    }

    const schoolUser = await db
      .from('school_users')
      .where('user_id', user.id)
      .where('school_id', schoolId)
      .select('role_id')
      .first()

    const roleId = schoolUser?.role_id

    // Session school context is stale or unauthorized for this user
    if (!roleId && !superAdmin) {
      session.forget('schoolId')
      const membership = await db
        .from('school_users')
        .where('user_id', user.id)
        .count('* as total')
        .first()
      const membershipCount = Number(membership?.total ?? 0)

      return membershipCount > 0
        ? response.redirect().toRoute('schools.select')
        : response.redirect().toRoute('login.show')
    }

    if (roleId === Roles.TEACHER) {
      const staff = await Staff.query().where('schoolId', schoolId).where('userId', user.id).first()

      if (staff) {
        const stats = await DashboardService.getTeacherStats(schoolId, staff.id)
        return inertia.render('school/dashboards/teacher', { stats })
      }
    }

    const stats = await DashboardService.getSchoolAdminStats(schoolId)

    const canSee = superAdmin
      ? { fees: true, subscription: true, attendance: true, staff: true }
      : {
          fees: [Roles.SCHOOL_ADMIN, Roles.ACCOUNTANT].includes(roleId),
          subscription: roleId === Roles.SCHOOL_ADMIN,
          attendance: [Roles.SCHOOL_ADMIN, Roles.PRINCIPAL, Roles.VICE_PRINCIPAL, Roles.SUPPORT_STAFF].includes(roleId),
          staff: [Roles.SCHOOL_ADMIN, Roles.PRINCIPAL, Roles.VICE_PRINCIPAL].includes(roleId),
        }

    return inertia.render('school/dashboards/admin', { stats, canSee })
  }
}

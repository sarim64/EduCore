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

    // Check if user is a super admin
    const superAdmin = await SuperAdmin.query()
      .where('userId', user.id)
      .whereNull('revokedAt')
      .first()

    // If super admin without school context, redirect to admin dashboard
    if (superAdmin && !schoolId) {
      return response.redirect().toRoute('admin.dashboard')
    }

    // If regular user without school context, redirect to school creation
    if (!schoolId) {
      const memberships = await db.from('school_users').where('user_id', user.id).count('* as total')
      const membershipCount = Number(memberships[0].total ?? 0)
      return membershipCount > 0
        ? response.redirect().toRoute('schools.select')
        : response.redirect().toRoute('schools.create')
    }

    // Get user's role for this school
    const schoolUser = await db
      .from('school_users')
      .where('user_id', user.id)
      .where('school_id', schoolId)
      .select('role_id')
      .first()

    const roleId = schoolUser?.role_id

    // Session school context is stale or unauthorized for this user.
    if (!roleId && !superAdmin) {
      session.forget('schoolId')
      const memberships = await db.from('school_users').where('user_id', user.id).count('* as total')
      const membershipCount = Number(memberships[0].total ?? 0)
      return membershipCount > 0
        ? response.redirect().toRoute('schools.select')
        : response.redirect().toRoute('schools.create')
    }

    // Route to appropriate dashboard based on role
    if (roleId === Roles.TEACHER) {
      // Get staff record linked to this user
      const staff = await Staff.query().where('schoolId', schoolId).where('userId', user.id).first()

      if (staff) {
        const stats = await DashboardService.getTeacherStats(schoolId, staff.id)
        return inertia.render('dashboards/teacher', { stats })
      }
    }

    // Default: School Admin / Principal dashboard
    const stats = await DashboardService.getSchoolAdminStats(schoolId)
    return inertia.render('home', { stats })
  }
}

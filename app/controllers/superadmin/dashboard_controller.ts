import type { HttpContext } from '@adonisjs/core/http'
import GetAdminDashboardStats from '#actions/superadmin/get_admin_dashboard_stats'

export default class DashboardController {
  async index({ inertia }: HttpContext) {
    const { stats } = await GetAdminDashboardStats.handle()

    return inertia.render('superadmin/dashboard', { stats })
  }
}

import type { HttpContext } from '@adonisjs/core/http'
import GetAdminDashboardStats from '#actions/admin/get_admin_dashboard_stats'

export default class DashboardController {
  async index({ inertia }: HttpContext) {
    const { stats, schools } = await GetAdminDashboardStats.handle()

    return inertia.render('admin/dashboard', {
      stats,
      schools,
    })
  }
}

import type { HttpContext } from '@adonisjs/core/http'

export default class AttendanceController {
  async index({ inertia }: HttpContext) {
    return inertia.render('school/attendance/index')
  }
}

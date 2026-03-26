import type { HttpContext } from '@adonisjs/core/http'
import AccessControlService from '#services/access_control_service'
import SaveAccessControlSettings from '#actions/school/save_access_control_settings'
import { updateAccessControlValidator } from '#validators/access_control'

export default class AccessControlController {
  async index({ inertia, session }: HttpContext) {
    const schoolId = session.get('schoolId') as string
    const settings = await AccessControlService.getAllSettings(schoolId)
    return inertia.render('school/access_control', { settings })
  }

  async update({ request, session, response }: HttpContext) {
    const schoolId = session.get('schoolId') as string
    const { settings } = await request.validateUsing(updateAccessControlValidator)
    await new SaveAccessControlSettings().handle(schoolId, settings)
    return response.redirect().back()
  }
}

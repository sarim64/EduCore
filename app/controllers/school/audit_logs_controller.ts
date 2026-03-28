import type { HttpContext } from '@adonisjs/core/http'
import AuditLogDto from '#dtos/audit_log'
import ListSchoolAuditLogs from '#actions/school/list_audit_logs'

export default class AuditLogsController {
  async index({ inertia, request, school }: HttpContext) {
    const page = request.input('page', 1)
    const search = request.input('search', null)
    const action = request.input('action', null)
    const from = request.input('from', null)
    const to = request.input('to', null)
    const limit = 50

    const logs = await ListSchoolAuditLogs.handle({
      schoolId: school!.id,
      page,
      limit,
      search,
      action,
      from,
      to,
    })

    return inertia.render('school/audit-logs/index', {
      logs: {
        data: AuditLogDto.fromArray(logs.all()),
        meta: logs.getMeta(),
      },
      filters: { search, action, from, to },
    })
  }
}

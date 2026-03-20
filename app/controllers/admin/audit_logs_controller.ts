import type { HttpContext } from '@adonisjs/core/http'
import AdminAuditLogDto from '#dtos/admin_audit_log'
import ListAuditLogs from '#actions/admin/list_audit_logs'

export default class AuditLogsController {
  async index({ inertia, request }: HttpContext) {
    const page = request.input('page', 1)
    const limit = 50

    const logs = await ListAuditLogs.handle({ page, limit })

    return inertia.render('admin/audit-logs/index', {
      logs: {
        data: AdminAuditLogDto.fromArray(logs.all()),
        meta: logs.getMeta(),
      },
    })
  }
}

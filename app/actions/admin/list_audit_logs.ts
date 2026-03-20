import AdminAuditLog from '#models/admin_audit_log'

type Params = {
  page?: number
  limit?: number
}

export default class ListAuditLogs {
  static async handle({ page = 1, limit = 50 }: Params) {
    return AdminAuditLog.query()
      .preload('superAdmin', (query) => {
        query.preload('user')
      })
      .preload('targetSchool')
      .preload('targetUser')
      .orderBy('createdAt', 'desc')
      .paginate(page, limit)
  }
}

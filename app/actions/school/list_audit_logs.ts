import AuditLog from '#models/audit_log'

type Params = {
  schoolId: string
  page?: number
  limit?: number
  search?: string | null
  action?: string | null
  from?: string | null
  to?: string | null
}

export default class ListSchoolAuditLogs {
  static async handle({ schoolId, page = 1, limit = 50, search, action, from, to }: Params) {
    const query = AuditLog.query()
      .where('school_id', schoolId)
      .preload('user')
      .orderBy('created_at', 'desc')

    if (action) {
      query.where('action', action)
    }

    if (from) {
      query.where('created_at', '>=', from)
    }

    if (to) {
      query.where('created_at', '<=', `${to} 23:59:59`)
    }

    if (search) {
      query.where((q) => {
        q.whereHas('user', (userQ) => {
          userQ
            .whereILike('first_name', `%${search}%`)
            .orWhereILike('last_name', `%${search}%`)
            .orWhereILike('email', `%${search}%`)
        })
          .orWhereILike('action', `%${search}%`)
          .orWhereILike('ip_address', `%${search}%`)
      })
    }

    return query.paginate(page, limit)
  }
}

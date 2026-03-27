import { BaseModelDto } from '@adocasts.com/dto/base'
import AuditLog from '#models/audit_log'

export default class AuditLogDto extends BaseModelDto {
  declare id: string
  declare action: string
  declare entityType: string
  declare entityId: string | null
  declare description: string | null
  declare ipAddress: string | null
  declare userAgent: string | null
  declare oldValues: Record<string, unknown> | null
  declare newValues: Record<string, unknown> | null
  declare createdAt: string
  declare user: { id: string; firstName: string; lastName: string | null; email: string } | null

  constructor(log?: AuditLog) {
    super()

    if (!log) return
    this.id = log.id
    this.action = log.action
    this.entityType = log.entityType
    this.entityId = log.entityId
    this.description = log.description
    this.ipAddress = log.ipAddress
    this.userAgent = log.userAgent
    this.oldValues = log.oldValues
    this.newValues = log.newValues
    this.createdAt = log.createdAt.toISO()!
    this.user = log.user
      ? {
          id: log.user.id,
          firstName: log.user.firstName,
          lastName: log.user.lastName,
          email: log.user.email,
        }
      : null
  }
}

import { BaseModelDto } from '@adocasts.com/dto/base'
import AdminAuditLog from '#models/admin_audit_log'

export default class AdminAuditLogDto extends BaseModelDto {
  declare id: string
  declare superAdminId: string
  declare action: string
  declare entityType: string
  declare entityId: string
  declare targetSchoolId: string | null
  declare targetUserId: string | null
  declare oldValues: Record<string, unknown> | null
  declare newValues: Record<string, unknown> | null
  declare ipAddress: string | null
  declare userAgent: string | null
  declare description: string | null
  declare createdAt: string
  declare superAdmin: { id: string; user: { id: string; firstName: string; lastName: string | null; email: string } | null } | null
  declare targetSchool: { id: string; name: string } | null
  declare targetUser: { id: string; firstName: string; lastName: string | null; email: string } | null

  constructor(log?: AdminAuditLog) {
    super()

    if (!log) return
    this.id = log.id
    this.superAdminId = log.superAdminId
    this.action = log.action
    this.entityType = log.entityType
    this.entityId = log.entityId
    this.targetSchoolId = log.targetSchoolId
    this.targetUserId = log.targetUserId
    this.oldValues = log.oldValues
    this.newValues = log.newValues
    this.ipAddress = log.ipAddress
    this.userAgent = log.userAgent
    this.description = log.description
    this.createdAt = log.createdAt.toISO()!
    this.superAdmin = log.superAdmin
      ? {
          id: log.superAdmin.id,
          user: log.superAdmin.user
            ? {
                id: log.superAdmin.user.id,
                firstName: log.superAdmin.user.firstName,
                lastName: log.superAdmin.user.lastName,
                email: log.superAdmin.user.email,
              }
            : null,
        }
      : null
    this.targetSchool = log.targetSchool
      ? { id: log.targetSchool.id, name: log.targetSchool.name }
      : null
    this.targetUser = log.targetUser
      ? {
          id: log.targetUser.id,
          firstName: log.targetUser.firstName,
          lastName: log.targetUser.lastName,
          email: log.targetUser.email,
        }
      : null
  }
}

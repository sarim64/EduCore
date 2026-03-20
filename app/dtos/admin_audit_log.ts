import { BaseModelDto } from '@adocasts.com/dto/base'
import AdminAuditLog from '#models/admin_audit_log'
import SuperAdminDto from '#dtos/super_admin'
import SchoolDto from '#dtos/school'
import UserDto from '#dtos/user'

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
  declare superAdmin: SuperAdminDto | null
  declare targetSchool: SchoolDto | null
  declare targetUser: UserDto | null

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
    this.superAdmin = log.superAdmin ? new SuperAdminDto(log.superAdmin) : null
    this.targetSchool = log.targetSchool ? new SchoolDto(log.targetSchool) : null
    this.targetUser = log.targetUser ? new UserDto(log.targetUser) : null
  }
}

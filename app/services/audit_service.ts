import AuditLog from '#models/audit_log'
import { HttpContext } from '@adonisjs/core/http'

type AuditParams = {
  schoolId?: string | null
  userId?: string | null
  action: string
  entityType: string
  entityId?: string | null
  oldValues?: Record<string, unknown> | null
  newValues?: Record<string, unknown> | null
  description?: string | null
}

export default class AuditService {
  /**
   * Log an audit event
   */
  static async log(params: AuditParams, ctx?: HttpContext) {
    const ipAddress = ctx?.request.ip()
    const userAgent = ctx?.request.header('user-agent')

    return AuditLog.create({
      schoolId: params.schoolId ?? null,
      userId: params.userId ?? null,
      action: params.action,
      entityType: params.entityType,
      entityId: params.entityId ?? null,
      oldValues: params.oldValues ?? null,
      newValues: params.newValues ?? null,
      ipAddress: ipAddress ?? null,
      userAgent: userAgent ?? null,
      description: params.description ?? null,
    })
  }

  /**
   * Log a create action
   */
  static async logCreate(
    entityType: string,
    entityId: string,
    newValues: Record<string, unknown>,
    ctx?: HttpContext,
    schoolId?: string,
    userId?: string
  ) {
    return this.log(
      {
        schoolId,
        userId,
        action: 'create',
        entityType,
        entityId,
        newValues,
        description: `Created ${entityType}`,
      },
      ctx
    )
  }

  /**
   * Log an update action
   */
  static async logUpdate(
    entityType: string,
    entityId: string,
    oldValues: Record<string, unknown>,
    newValues: Record<string, unknown>,
    ctx?: HttpContext,
    schoolId?: string,
    userId?: string
  ) {
    return this.log(
      {
        schoolId,
        userId,
        action: 'update',
        entityType,
        entityId,
        oldValues,
        newValues,
        description: `Updated ${entityType}`,
      },
      ctx
    )
  }

  /**
   * Log a delete action
   */
  static async logDelete(
    entityType: string,
    entityId: string,
    oldValues: Record<string, unknown>,
    ctx?: HttpContext,
    schoolId?: string,
    userId?: string
  ) {
    return this.log(
      {
        schoolId,
        userId,
        action: 'delete',
        entityType,
        entityId,
        oldValues,
        description: `Deleted ${entityType}`,
      },
      ctx
    )
  }

  /**
   * Log a login action
   */
  static async logLogin(userId: string, ctx?: HttpContext, schoolId?: string) {
    return this.log(
      {
        schoolId,
        userId,
        action: 'login',
        entityType: 'User',
        entityId: userId,
        description: 'User logged in',
      },
      ctx
    )
  }

  /**
   * Log a logout action
   */
  static async logLogout(userId: string, ctx?: HttpContext, schoolId?: string) {
    return this.log(
      {
        schoolId,
        userId,
        action: 'logout',
        entityType: 'User',
        entityId: userId,
        description: 'User logged out',
      },
      ctx
    )
  }
}

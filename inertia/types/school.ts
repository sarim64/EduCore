export type SchoolAuditLog = {
  id: string
  action: string
  entityType: string
  entityId: string | null
  description: string | null
  ipAddress: string | null
  userAgent: string | null
  oldValues: Record<string, unknown> | null
  newValues: Record<string, unknown> | null
  createdAt: string
  user: {
    id: string
    firstName: string
    lastName: string | null
    email: string
  } | null
}

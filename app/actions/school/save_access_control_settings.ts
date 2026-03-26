import AccessControlSetting from '#models/access_control_setting'
import { ALL_PERMISSIONS, CONFIGURABLE_ROLES } from '#services/access_control_service'

export default class SaveAccessControlSettings {
  async handle(schoolId: string, payload: Record<string, Record<number, boolean>>): Promise<void> {
    // Sanitize: only accept known permission keys and configurable role IDs.
    // Prevents malicious payloads from writing rows for SCHOOL_ADMIN/SUPER_ADMIN
    // or inventing arbitrary permission strings.
    const validPermissions = new Set<string>(ALL_PERMISSIONS)
    const validRoles = new Set<number>(CONFIGURABLE_ROLES)

    const rows = Object.entries(payload).flatMap(([permission, roleMap]) => {
      if (!validPermissions.has(permission)) return []
      return Object.entries(roleMap).flatMap(([roleId, enabled]) => {
        const numericRoleId = Number(roleId)
        if (!validRoles.has(numericRoleId)) return []
        return [{ schoolId, roleId: numericRoleId, permission, enabled: Boolean(enabled) }]
      })
    })

    if (rows.length === 0) return

    await AccessControlSetting.updateOrCreateMany(['schoolId', 'roleId', 'permission'], rows)
  }
}

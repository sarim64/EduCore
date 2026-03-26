import Roles from '#enums/roles'
import AccessControlSetting from '#models/access_control_setting'

// All configurable roles (School Admin and Superadmin always see everything)
export const CONFIGURABLE_ROLES = [
  Roles.PRINCIPAL,
  Roles.VICE_PRINCIPAL,
  Roles.ACCOUNTANT,
  Roles.TEACHER,
  Roles.SUPPORT_STAFF,
] as const

// Active card permissions (rendered on dashboard now)
// To add a card: append a key here + add to DEFAULTS + add to CARD_REGISTRY on the frontend
export const CARD_PERMISSIONS = [
  'dashboard.cards.students',
  'dashboard.cards.student_attendance',
  'dashboard.cards.staff',
  'dashboard.cards.staff_attendance',
  'dashboard.cards.fee_today',
  'dashboard.cards.fee_month',
] as const

// List permissions (coming soon — stored in DB but not yet used on dashboard)
// To add a list: append a key here + add to DEFAULTS + add to LIST_REGISTRY on the frontend
export const LIST_PERMISSIONS = [
  'dashboard.lists.low_attendance',
  'dashboard.lists.attendance_by_class',
  'dashboard.lists.chronically_absent',
  'dashboard.lists.pending_leaves',
  'dashboard.lists.fee_defaulters',
  'dashboard.lists.class_in_charge',
  'dashboard.lists.absent_staff',
  'dashboard.lists.quick_actions',
  'dashboard.lists.recent_activity',
  'dashboard.lists.alerts',
] as const

// Chart permissions (coming soon — empty now, same extensibility pattern)
export const CHART_PERMISSIONS = [] as const

// All configurable permissions combined
export const ALL_PERMISSIONS = [
  ...CARD_PERMISSIONS,
  ...LIST_PERMISSIONS,
  ...CHART_PERMISSIONS,
] as const

// Defaults used when no DB row exists for a school
// Structure: permission → roleId → enabled
const DEFAULTS: Record<string, Partial<Record<Roles, boolean>>> = {
  'dashboard.cards.students': { [Roles.PRINCIPAL]: true, [Roles.VICE_PRINCIPAL]: true },
  'dashboard.cards.student_attendance': {
    [Roles.PRINCIPAL]: true,
    [Roles.VICE_PRINCIPAL]: true,
    [Roles.TEACHER]: true,
  },
  'dashboard.cards.staff': { [Roles.PRINCIPAL]: true, [Roles.VICE_PRINCIPAL]: true },
  'dashboard.cards.staff_attendance': { [Roles.PRINCIPAL]: true, [Roles.VICE_PRINCIPAL]: true },
  'dashboard.cards.fee_today': { [Roles.ACCOUNTANT]: true },
  'dashboard.cards.fee_month': { [Roles.ACCOUNTANT]: true },
  'dashboard.lists.low_attendance': { [Roles.PRINCIPAL]: true, [Roles.VICE_PRINCIPAL]: true },
  'dashboard.lists.attendance_by_class': {
    [Roles.PRINCIPAL]: true,
    [Roles.VICE_PRINCIPAL]: true,
    [Roles.TEACHER]: true,
  },
  'dashboard.lists.chronically_absent': { [Roles.PRINCIPAL]: true, [Roles.VICE_PRINCIPAL]: true },
  'dashboard.lists.pending_leaves': { [Roles.PRINCIPAL]: true, [Roles.VICE_PRINCIPAL]: true },
  'dashboard.lists.fee_defaulters': { [Roles.ACCOUNTANT]: true },
  'dashboard.lists.class_in_charge': { [Roles.TEACHER]: true },
  'dashboard.lists.absent_staff': { [Roles.PRINCIPAL]: true, [Roles.VICE_PRINCIPAL]: true },
  'dashboard.lists.quick_actions': {
    [Roles.PRINCIPAL]: true,
    [Roles.VICE_PRINCIPAL]: true,
    [Roles.ACCOUNTANT]: true,
    [Roles.TEACHER]: true,
  },
  'dashboard.lists.recent_activity': { [Roles.PRINCIPAL]: true, [Roles.VICE_PRINCIPAL]: true },
  'dashboard.lists.alerts': {
    [Roles.PRINCIPAL]: true,
    [Roles.VICE_PRINCIPAL]: true,
    [Roles.ACCOUNTANT]: true,
    [Roles.TEACHER]: true,
    [Roles.SUPPORT_STAFF]: true,
  },
}

export default class AccessControlService {
  private static resolve(
    rows: AccessControlSetting[],
    permission: string,
    roleId: Roles
  ): boolean {
    const row = rows.find((r) => r.permission === permission && r.roleId === roleId)
    if (row) return row.enabled
    return DEFAULTS[permission]?.[roleId] ?? false
  }

  static async getCanSeeForRole(schoolId: string, roleId: Roles): Promise<Record<string, boolean>> {
    const rows = await AccessControlSetting.query()
      .where('schoolId', schoolId)
      .whereIn('permission', [...ALL_PERMISSIONS])

    const canSee: Record<string, boolean> = {}
    for (const permission of ALL_PERMISSIONS) {
      canSee[permission] = this.resolve(rows, permission, roleId)
    }
    // subscription is admin-only; always false for other roles
    canSee['dashboard.cards.subscription'] = false
    return canSee
  }

  static getFullAccess(): Record<string, boolean> {
    const canSee: Record<string, boolean> = {}
    for (const permission of ALL_PERMISSIONS) {
      canSee[permission] = true
    }
    canSee['dashboard.cards.subscription'] = true
    return canSee
  }

  static async getAllSettings(schoolId: string) {
    const rows = await AccessControlSetting.query().where('schoolId', schoolId)

    const result: Record<string, Record<number, boolean>> = {}

    for (const permission of ALL_PERMISSIONS) {
      result[permission] = {}
      for (const roleId of CONFIGURABLE_ROLES) {
        result[permission][roleId] = this.resolve(rows, permission, roleId)
      }
    }

    return result
  }
}

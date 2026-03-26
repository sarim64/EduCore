import SuperAdmin from '#models/super_admin'
import Staff from '#models/staff_member'
import db from '@adonisjs/lucid/services/db'
import Roles from '#enums/roles'

type DashboardContext =
  | { kind: 'redirectToAdmin' }
  | { kind: 'redirectToSelect' }
  | { kind: 'redirectToLogin' }
  | { kind: 'teacher'; schoolId: string; staffId: string }
  | { kind: 'admin'; schoolId: string; isSuperAdmin: boolean; roleId: Roles | null }

export default class ResolveDashboardContext {
  async handle(userId: string, schoolId: string | null): Promise<DashboardContext> {
    const superAdmin = await SuperAdmin.query()
      .where('userId', userId)
      .whereNull('revokedAt')
      .first()

    if (superAdmin && !schoolId) {
      return { kind: 'redirectToAdmin' }
    }

    if (!schoolId) {
      return this.redirectBasedOnMembership(userId)
    }

    const schoolUser = await db
      .from('school_users')
      .where('user_id', userId)
      .where('school_id', schoolId)
      .select('role_id')
      .first()

    const roleId = schoolUser?.role_id as Roles | undefined

    if (!roleId && !superAdmin) {
      return this.redirectBasedOnMembership(userId)
    }

    if (roleId === Roles.TEACHER) {
      const staff = await Staff.query()
        .where('schoolId', schoolId)
        .where('userId', userId)
        .first()

      if (staff) {
        return { kind: 'teacher', schoolId, staffId: staff.id }
      }
    }

    return {
      kind: 'admin',
      schoolId,
      isSuperAdmin: !!superAdmin,
      roleId: roleId ?? null,
    }
  }

  private async redirectBasedOnMembership(userId: string): Promise<DashboardContext> {
    const membership = await db
      .from('school_users')
      .where('user_id', userId)
      .count('* as total')
      .first()

    return Number(membership?.total ?? 0) > 0
      ? { kind: 'redirectToSelect' }
      : { kind: 'redirectToLogin' }
  }
}

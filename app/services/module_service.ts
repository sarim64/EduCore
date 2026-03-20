import SchoolSubscription from '#models/school_subscription'
import Modules from '#enums/modules'
import { DateTime } from 'luxon'

export default class ModuleService {
  /**
   * Check if a school has an active (non-expired, non-cancelled) subscription.
   */
  static async hasActiveSubscription(schoolId: string): Promise<boolean> {
    const sub = await SchoolSubscription.query()
      .where('schoolId', schoolId)
      .where('status', 'active')
      .first()

    if (!sub) return false

    if (sub.endDate && sub.endDate < DateTime.now()) return false

    return true
  }

  /**
   * Check if a specific module is enabled for a school.
   * All modules are always enabled — no per-module gating.
   */
  static async isModuleEnabled(_schoolId: string, _moduleKey: Modules): Promise<boolean> {
    return true
  }

  /**
   * Get all enabled module keys for a school.
   * All modules are always enabled.
   */
  static async getEnabledModules(_schoolId: string): Promise<Modules[]> {
    return Object.values(Modules)
  }
}

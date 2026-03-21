import Modules from '#enums/modules'

enum SubscriptionPlans {
  TRIAL = 'trial',
  BASIC = 'basic',
  PRO = 'pro',
}

export default SubscriptionPlans

export const PLAN_METADATA: Record<
  SubscriptionPlans,
  {
    name: string
    code: SubscriptionPlans
    description: string
    durationMonths: number | null
    priceYearly: number | null
    isFree: boolean
    isActive: boolean
    autoAssignToNewSchools: boolean
    modules: Modules[]
    displayOrder: number
    badge: string | null
  }
> = {
  [SubscriptionPlans.TRIAL]: {
    name: 'Trial',
    code: SubscriptionPlans.TRIAL,
    description: '3 months free trial for all new schools — no payment required',
    durationMonths: 3,
    priceYearly: null,
    isFree: true,
    isActive: true,
    autoAssignToNewSchools: true,
    modules: [
      Modules.ACADEMICS,
      Modules.STUDENTS,
      Modules.STAFF,
      Modules.ATTENDANCE,
      Modules.FEES,
      Modules.REPORTS,
    ],
    displayOrder: 1,
    badge: 'Free',
  },
  [SubscriptionPlans.BASIC]: {
    name: 'Basic',
    code: SubscriptionPlans.BASIC,
    description: 'Full access to all current modules — continuation after trial',
    durationMonths: 12,
    priceYearly: 15000,
    isFree: false,
    isActive: true,
    autoAssignToNewSchools: false,
    modules: [
      Modules.ACADEMICS,
      Modules.STUDENTS,
      Modules.STAFF,
      Modules.ATTENDANCE,
      Modules.FEES,
      Modules.REPORTS,
    ],
    displayOrder: 2,
    badge: null,
  },
  [SubscriptionPlans.PRO]: {
    name: 'Pro',
    code: SubscriptionPlans.PRO,
    description: 'Reserved for future modules — coming soon',
    durationMonths: 12,
    priceYearly: null,
    isFree: false,
    isActive: false,
    autoAssignToNewSchools: false,
    modules: [],
    displayOrder: 3,
    badge: 'Coming Soon',
  },
}

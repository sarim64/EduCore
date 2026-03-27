export type User = {
  id: string
  firstName: string
  lastName: string | null
  email: string
  createdAt?: string
}

export type School = {
  id: string
  name: string
  code: string | null
  address: string | null
  phone: string | null
  city: string | null
  province: string | null
  isSuspended: boolean
  createdAt: string
  updatedAt: string | null
  users?: User[]
}

export type SchoolListItem = {
  id: string
  name: string
  code: string | null
  city: string | null
  province: string | null
  isSuspended: boolean
  createdAt: string
  status: 'active' | 'expiring' | 'expired' | 'suspended'
  studentsCount: number
  primaryAdmin: { name: string; email: string } | null
  subscription: {
    id: string
    planId: string | null
    planName: string | null
    planCode: string | null
    endDate: string | null
    status: string
  } | null
}

export type SchoolSubscriptionHistory = {
  id: string
  planId: string | null
  status: string
  startDate: string
  endDate: string | null
  maxStudents: number | null
  notes: string | null
  plan: { name: string; code: string } | null
}

export type ExpiringSoonItem = {
  name: string
  expiresAt: string
}

export type SubscriptionPlan = {
  id: string
  name: string
  code: string
  description: string | null
  priceMonthly: number
  priceYearly: number
  maxStudents: number
  maxStaff: number
  isActive: boolean
  createdAt?: string
  updatedAt?: string
}

export type SchoolSubscription = {
  id: string
  schoolId: string
  planId: string | null
  status: string
  startDate: string
  endDate: string | null
  maxStudents: number | null
  maxStaff: number | null
  customPrice: number | null
  notes: string | null
  plan: SubscriptionPlan | null
  school: { id: string; name: string } | null
}

export type AuditLog = {
  id: string
  action: string
  entityType: string
  entityId: string
  description: string | null
  ipAddress: string | null
  userAgent: string | null
  oldValues: Record<string, unknown> | null
  newValues: Record<string, unknown> | null
  createdAt: string
  superAdmin: {
    id: string
    user: { id: string; firstName: string; lastName: string | null; email: string } | null
  } | null
  targetSchool: { id: string; name: string } | null
  targetUser: { id: string; firstName: string; lastName: string | null; email: string } | null
}

export type PaginationMeta = {
  total: number
  perPage: number
  currentPage: number
  lastPage: number
}

export type AdminDashboardStats = {
  schoolsCount: number
  schoolsThisMonth: number
  superAdminsCount: number
  totalStudents: number
  activeSubscriptionsCount: number
  expiringSoonCount: number
  recentSchools: SchoolListItem[]
  planDistribution: { trial: number; basic: number; pro: number }
  expiringSoon: ExpiringSoonItem[]
}

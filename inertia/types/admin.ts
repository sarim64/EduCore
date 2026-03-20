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
  createdAt: string
  updatedAt: string | null
  users?: User[]
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
}

export type AuditLog = {
  id: string
  action: string
  entityType: string
  entityId: string
  description: string | null
  ipAddress: string | null
  createdAt: string
  superAdmin: AuditLogSuperAdmin | null
  targetSchool: { id: string; name: string } | null
  targetUser: User | null
}

export type AuditLogSuperAdmin = {
  id: string
  user: {
    id: string
    firstName: string
    lastName: string | null
    email: string
  } | null
}

export type PaginationMeta = {
  total: number
  perPage: number
  currentPage: number
  lastPage: number
}

export type AdminDashboardStats = {
  schoolsCount: number
  superAdminsCount: number
  totalStudents: number
  totalEnrollments: number
}

export type AdminSchoolStats = {
  id: string
  name: string
  studentsCount: number
  enrollmentsCount: number
}

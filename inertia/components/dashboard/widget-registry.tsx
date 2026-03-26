import type { SchoolAdminDashboardStats } from '~/types/dashboard'
import StatCard from '~/components/dashboard/StatCard'
import FeeCollectionChart from '~/components/dashboard/FeeCollectionChart'
import {
  GraduationCap,
  UserCheck,
  Users,
  DollarSign,
} from 'lucide-react'
import { formatPKR } from '~/lib/format-pkr'

// ── Card registry ─────────────────────────────────────────────────────────────
export type CardDef = {
  permissionKey: string
  label: string
  render: (stats: SchoolAdminDashboardStats) => React.ReactNode
}

export const CARD_REGISTRY: CardDef[] = [
  {
    permissionKey: 'dashboard.cards.students',
    label: 'Total Students',
    render: (stats) => (
      <StatCard
        title="Total Students"
        value={stats.students.total}
        subtitle={`+${stats.students.newThisMonth} this month`}
        icon={GraduationCap}
        iconBg="bg-blue-100 text-blue-600"
      />
    ),
  },
  {
    permissionKey: 'dashboard.cards.student_attendance',
    label: 'Student Attendance (Today)',
    render: (stats) => (
      <StatCard
        title="Student Attendance Today"
        value={`${stats.attendance.todayStudentRate}%`}
        subtitle={`${stats.attendance.todayAbsent} students absent`}
        icon={UserCheck}
        iconBg="bg-green-100 text-green-600"
      />
    ),
  },
  {
    permissionKey: 'dashboard.cards.staff',
    label: 'Total Staff',
    render: (stats) => (
      <StatCard
        title="Total Staff"
        value={stats.staff.active}
        subtitle={`${stats.staff.teachersCount} teachers · ${stats.staff.supportCount} support`}
        icon={Users}
        iconBg="bg-purple-100 text-purple-600"
      />
    ),
  },
  {
    permissionKey: 'dashboard.cards.staff_attendance',
    label: 'Staff Attendance (Today)',
    render: (stats) => (
      <StatCard
        title="Staff Attendance Today"
        value={`${stats.attendance.todayStaffRate}%`}
        subtitle={`${stats.attendance.todayStaffAbsent} staff absent`}
        icon={UserCheck}
        iconBg="bg-teal-100 text-teal-600"
      />
    ),
  },
  {
    permissionKey: 'dashboard.cards.fee_today',
    label: 'Fee Collection (Today)',
    render: (stats) => (
      <StatCard
        title="Fee Collection Today"
        value={formatPKR(stats.fees.todayAmount)}
        subtitle={`${stats.fees.todayPaymentCount} payments received`}
        icon={DollarSign}
        iconBg="bg-emerald-100 text-emerald-600"
      />
    ),
  },
  {
    permissionKey: 'dashboard.cards.fee_month',
    label: 'Fee Collection (This Month)',
    render: (stats) => (
      <StatCard
        title="Fee Collection This Month"
        value={formatPKR(stats.fees.monthAmount)}
        subtitle={
          stats.fees.previousMonthAmount > 0
            ? `${Math.round(((stats.fees.monthAmount - stats.fees.previousMonthAmount) / stats.fees.previousMonthAmount) * 100)}% vs prior month`
            : undefined
        }
        icon={DollarSign}
        iconBg="bg-indigo-100 text-indigo-600"
      />
    ),
  },
  // subscription is admin-only (not in registry — handled separately in admin.tsx)
]

// ── List registry ─────────────────────────────────────────────────────────────
export type ListDef = {
  permissionKey: string
  title: string
  render: (stats: SchoolAdminDashboardStats) => React.ReactNode
}

export const LIST_REGISTRY: ListDef[] = [
  // populated when list widgets are built; entries follow the same pattern
]

// ── Chart registry ────────────────────────────────────────────────────────────
export type ChartDef = {
  /** One or more permission keys — chart shows if ANY is true */
  permissionKeys: string[]
  label: string
  render: (stats: SchoolAdminDashboardStats) => React.ReactNode
}

export const CHART_REGISTRY: ChartDef[] = [
  {
    permissionKeys: ['dashboard.cards.fee_today', 'dashboard.cards.fee_month'],
    label: 'Fee Collection Chart',
    render: (stats) => <FeeCollectionChart fees={stats.fees} />,
  },
]

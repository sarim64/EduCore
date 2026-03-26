import { Head } from '@inertiajs/react'
import { type ReactElement } from 'react'
import { usePage } from '@inertiajs/react'
import { DateTime } from 'luxon'
import DashboardLayout from '~/layouts/DashboardLayout'
import { Progress } from '~/components/ui/progress'
import { Badge } from '~/components/ui/badge'
import {
  TrendingUp,
  TrendingDown,
  Users,
  GraduationCap,
  UserCheck,
  DollarSign,
  Package,
  CreditCard,
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import type { SchoolAdminDashboardStats, CanSeeFlags } from '~/types/dashboard'
import type { SharedProps } from '~/types'
import { formatPKR } from '~/lib/format-pkr'

// ─── Helpers ────────────────────────────────────────────────────────────────

function getGreeting(): string {
  const hour = DateTime.now().hour
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

// ─── StatCard ───────────────────────────────────────────────────────────────

type StatCardProps = {
  title: string
  value: string | number
  subtitle?: string
  icon: React.ElementType
  iconBg: string
}

function StatCard({ title, value, subtitle, icon: Icon, iconBg }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-500">{title}</span>
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="text-3xl font-bold text-gray-900">{value}</div>
      {subtitle && <div className="text-xs text-gray-400 mt-1">{subtitle}</div>}
    </div>
  )
}

// ─── FeeCollectionChart ──────────────────────────────────────────────────────

function FeeCollectionChart({ fees }: { fees: SchoolAdminDashboardStats['fees'] }) {
  const formatDate = (iso: string) => DateTime.fromISO(iso).toFormat('MMM d')
  const formatYAxis = (value: number) => formatPKR(value)
  const { trendChangePercent } = fees

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h2 className="text-sm font-semibold text-gray-700 mb-4">Fee Collection — Last 2 Weeks</h2>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={fees.trend}>
          <XAxis dataKey="date" tickFormatter={formatDate} tick={{ fontSize: 12 }} />
          <YAxis tickFormatter={formatYAxis} width={80} tick={{ fontSize: 12 }} />
          <Tooltip
            formatter={(value: number | undefined) => [formatPKR(value ?? 0), 'Collected']}
            labelFormatter={formatDate}
          />
          <Bar dataKey="amount" fill="#6366f1" radius={[4, 4, 0, 0]}>
            {fees.trend.map((entry, i) => (
              <Cell key={i} fill={entry.amount === 0 ? '#e5e7eb' : '#6366f1'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="flex items-center gap-6 mt-3 text-sm text-gray-500">
        <span>
          Total: <span className="font-medium text-gray-900">{formatPKR(fees.trendTotal)}</span>
        </span>
        <span>
          Avg/day:{' '}
          <span className="font-medium text-gray-900">{formatPKR(fees.trendAvgPerDay)}</span>
        </span>
        <span className="flex items-center gap-1">
          {trendChangePercent >= 0 ? (
            <TrendingUp className="w-4 h-4 text-green-500" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-500" />
          )}
          <span
            className={trendChangePercent >= 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}
          >
            {Math.abs(trendChangePercent)}% vs previous 2 weeks
          </span>
        </span>
      </div>
    </div>
  )
}

// ─── SubscriptionUsageCard ───────────────────────────────────────────────────

function SubscriptionUsageCard({
  subscription,
  students,
  staff,
}: {
  subscription: NonNullable<SchoolAdminDashboardStats['subscription']>
  students: SchoolAdminDashboardStats['students']
  staff: SchoolAdminDashboardStats['staff']
}) {
  const studentsPercent =
    subscription.maxStudents > 0
      ? Math.round((students.total / subscription.maxStudents) * 100)
      : 0
  const staffPercent =
    subscription.maxStaff > 0 ? Math.round((staff.total / subscription.maxStaff) * 100) : 0

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-500">Subscription Usage</span>
        <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-violet-100 text-violet-600">
          <Package className="w-5 h-5" />
        </div>
      </div>
      <Badge className="mb-3 bg-green-100 text-green-700 hover:bg-green-100">Active</Badge>
      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Students</span>
            <span>
              {students.total} / {subscription.maxStudents}
            </span>
          </div>
          <Progress value={studentsPercent} className="h-2 [&>div]:bg-violet-600" />
        </div>
        <div>
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Staff</span>
            <span>
              {staff.total} / {subscription.maxStaff}
            </span>
          </div>
          <Progress value={staffPercent} className="h-2 [&>div]:bg-blue-500" />
        </div>
      </div>
    </div>
  )
}

// ─── PlanInfoCard ────────────────────────────────────────────────────────────

function PlanInfoCard({
  subscription,
}: {
  subscription: SchoolAdminDashboardStats['subscription']
}) {
  if (!subscription) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-500">Plan Information</span>
          <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-amber-100 text-amber-600">
            <CreditCard className="w-5 h-5" />
          </div>
        </div>
        <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">No active subscription</Badge>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-500">Plan Information</span>
        <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-violet-100 text-violet-600">
          <CreditCard className="w-5 h-5" />
        </div>
      </div>
      <Badge className="mb-3 bg-violet-100 text-violet-700 hover:bg-violet-100">
        {subscription.planName}
      </Badge>
      {subscription.expiryDate ? (
        <div className="bg-amber-50 rounded-lg p-3 text-sm">
          <div className="text-amber-700 font-medium">
            {DateTime.fromISO(subscription.expiryDate).toFormat('dd MMM yyyy')}
          </div>
          <div className="text-amber-500 text-xs mt-0.5">
            {subscription.daysRemaining} days remaining
          </div>
        </div>
      ) : (
        <div className="text-xs text-gray-400">No expiry date</div>
      )}
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function AdminDashboard({
  stats,
  canSee,
}: {
  stats: SchoolAdminDashboardStats
  canSee: CanSeeFlags
}) {
  const { user, currentSchool } = usePage<SharedProps>().props

  return (
    <>
      <Head title="Dashboard" />

      {/* Greeting */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {getGreeting()}, {user?.firstName}!
        </h1>
        {currentSchool && (
          <p className="text-sm text-gray-500 mt-0.5">{currentSchool.name}</p>
        )}
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {/* Total Students — all roles */}
        <StatCard
          title="Total Students"
          value={stats.students.total}
          subtitle={`+${stats.students.newThisMonth} this month`}
          icon={GraduationCap}
          iconBg="bg-blue-100 text-blue-600"
        />

        {/* Student Attendance */}
        {canSee.attendance && (
          <StatCard
            title="Student Attendance Today"
            value={`${stats.attendance.todayStudentRate}%`}
            subtitle={`${stats.attendance.todayAbsent} students absent`}
            icon={UserCheck}
            iconBg="bg-green-100 text-green-600"
          />
        )}

        {/* Total Staff */}
        {canSee.staff && (
          <StatCard
            title="Total Staff"
            value={stats.staff.active}
            subtitle={`${stats.staff.teachersCount} teachers · ${stats.staff.supportCount} support`}
            icon={Users}
            iconBg="bg-purple-100 text-purple-600"
          />
        )}

        {/* Staff Attendance */}
        {canSee.attendance && canSee.staff && (
          <StatCard
            title="Staff Attendance Today"
            value={`${stats.attendance.todayStaffRate}%`}
            subtitle={`${stats.attendance.todayStaffAbsent} staff absent`}
            icon={UserCheck}
            iconBg="bg-teal-100 text-teal-600"
          />
        )}

        {/* Fee Collection Today */}
        {canSee.fees && (
          <StatCard
            title="Fee Collection Today"
            value={formatPKR(stats.fees.todayAmount)}
            subtitle={`${stats.fees.todayPaymentCount} payments received`}
            icon={DollarSign}
            iconBg="bg-emerald-100 text-emerald-600"
          />
        )}

        {/* Fee Collection This Month */}
        {canSee.fees && (
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
        )}

        {/* Subscription Usage */}
        {canSee.subscription && stats.subscription && (
          <SubscriptionUsageCard
            subscription={stats.subscription}
            students={stats.students}
            staff={stats.staff}
          />
        )}

        {/* Plan Info */}
        {canSee.subscription && (
          <PlanInfoCard subscription={stats.subscription} />
        )}
      </div>

      {/* Fee Chart */}
      {canSee.fees && <FeeCollectionChart fees={stats.fees} />}
    </>
  )
}

AdminDashboard.layout = (page: ReactElement) => <DashboardLayout>{page}</DashboardLayout>

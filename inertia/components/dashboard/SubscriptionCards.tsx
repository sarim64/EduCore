import { DateTime } from 'luxon'
import { Package, CreditCard } from 'lucide-react'
import { Progress } from '~/components/ui/progress'
import { Badge } from '~/components/ui/badge'
import type { SchoolAdminDashboardStats } from '~/types/dashboard'

export function SubscriptionUsageCard({
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

export function PlanInfoCard({
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
        <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
          No active subscription
        </Badge>
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

import { type ReactElement } from 'react'
import { Head, Link } from '@inertiajs/react'
import SuperAdminLayout from '~/layouts/SuperAdminLayout'
import { School, CheckCircle, Users } from 'lucide-react'
import type { AdminDashboardStats } from '~/types'
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '~/components/ui/table'

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function planBadgeClass(planCode: string | null) {
  if (planCode === 'trial') return 'bg-blue-100 text-blue-700'
  if (planCode === 'basic') return 'bg-violet-100 text-violet-700'
  if (planCode === 'pro') return 'bg-emerald-100 text-emerald-700'
  return 'bg-gray-100 text-gray-600'
}

function statusBadgeClass(status: string) {
  if (status === 'active') return 'bg-green-100 text-green-700'
  if (status === 'expiring') return 'bg-amber-100 text-amber-700'
  if (status === 'expired') return 'bg-gray-100 text-gray-500'
  if (status === 'suspended') return 'bg-red-100 text-red-700'
  return 'bg-gray-100 text-gray-500'
}

function daysUntil(dateStr: string) {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000)
}

export default function AdminDashboardPage({ stats }: { stats: AdminDashboardStats }) {
  return (
    <>
      <Head title="Platform Overview" />

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Schools</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.schoolsCount}</p>
              <p className="text-xs text-green-600 mt-1">+{stats.schoolsThisMonth} this month</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center">
              <School className="w-5 h-5 text-violet-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Subscriptions</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {stats.activeSubscriptionsCount}
              </p>
              <p className="text-xs text-amber-600 mt-1">
                {stats.expiringSoonCount} expiring soon
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Students</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {stats.totalStudents.toLocaleString()}
              </p>
              <p className="text-xs text-green-600 mt-1">across all schools</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* Recent Schools */}
        <div className="col-span-2 bg-white rounded-xl border border-gray-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900 text-sm">Recent Schools</h2>
            <Link href="/admin/schools" className="text-xs text-violet-600 hover:text-violet-700">
              View all
            </Link>
          </div>

          {stats.recentSchools.length === 0 ? (
            <div className="py-10 text-center text-sm text-gray-400">No schools registered yet</div>
          ) : (
            <Table className="text-sm">
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50">
                  <TableHead className="px-5 py-3 text-gray-500">School</TableHead>
                  <TableHead className="px-5 py-3 text-gray-500 text-center">Plan</TableHead>
                  <TableHead className="px-5 py-3 text-gray-500 text-center">Students</TableHead>
                  <TableHead className="px-5 py-3 text-gray-500 text-center">Status</TableHead>
                  <TableHead className="px-5 py-3 text-gray-500 text-center">Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.recentSchools.map((school) => (
                  <TableRow key={school.id}>
                    <TableCell className="px-5 py-3 font-medium text-gray-900">
                      <Link
                        href={`/admin/schools/${school.id}`}
                        className="hover:text-violet-600 transition-colors"
                      >
                        {school.name}
                      </Link>
                    </TableCell>
                    <TableCell className="px-5 py-3 text-center">
                      {school.subscription?.planCode ? (
                        <span
                          className={`px-2 py-0.5 text-xs rounded font-medium ${planBadgeClass(school.subscription.planCode)}`}
                        >
                          {school.subscription.planName}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">—</span>
                      )}
                    </TableCell>
                    <TableCell className="px-5 py-3 text-gray-600 text-center">{school.studentsCount}</TableCell>
                    <TableCell className="px-5 py-3 text-center">
                      <span
                        className={`px-2 py-0.5 text-xs rounded-full font-medium ${statusBadgeClass(school.status)}`}
                      >
                        {school.status.charAt(0).toUpperCase() + school.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell className="px-5 py-3 text-gray-500 text-center">{formatDate(school.createdAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Plan Distribution */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-semibold text-gray-900 text-sm mb-3">Plan Distribution</h2>
            <div className="space-y-2">
              {[
                { label: 'Trial', count: stats.planDistribution.trial, color: 'bg-blue-500' },
                { label: 'Basic', count: stats.planDistribution.basic, color: 'bg-violet-500' },
                { label: 'Pro', count: stats.planDistribution.pro, color: 'bg-gray-300' },
              ].map(({ label, count, color }) => {
                const pct =
                  stats.schoolsCount > 0
                    ? Math.round((count / stats.schoolsCount) * 100)
                    : 0
                return (
                  <div key={label}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">{label}</span>
                      <span className="font-medium text-gray-900">{count} schools</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div
                        className={`${color} rounded-full h-1.5`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Expiring Subscriptions */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-semibold text-gray-900 text-sm mb-3">Expiring Subscriptions</h2>
            {stats.expiringSoon.length === 0 ? (
              <p className="text-xs text-gray-400">No subscriptions expiring soon</p>
            ) : (
              <div className="space-y-3">
                {stats.expiringSoon.map((item, i) => {
                  const days = daysUntil(item.expiresAt)
                  const urgent = days <= 7
                  return (
                    <div key={i} className="flex items-start gap-3">
                      <div
                        className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${urgent ? 'bg-red-500' : 'bg-amber-500'}`}
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.name}</p>
                        <p className={`text-xs ${urgent ? 'text-red-600' : 'text-amber-600'}`}>
                          Expires {formatDate(item.expiresAt)} ({days} days)
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

AdminDashboardPage.layout = (page: ReactElement) => <SuperAdminLayout>{page}</SuperAdminLayout>

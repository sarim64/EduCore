import { type ReactElement, useState } from 'react'
import { Head, Link, router, useForm } from '@inertiajs/react'
import SuperAdminLayout from '~/layouts/SuperAdminLayout'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import { FormField } from '~/components/FormField'
import { ArrowLeft, Ban, CheckCircle, Pencil, X } from 'lucide-react'
import type { School, SchoolSubscriptionHistory } from '~/types'
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '~/components/ui/table'

function getInitials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

function formatDate(dateStr: string | null | undefined) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function planBadgeClass(code: string | null | undefined) {
  if (code === 'trial') return 'bg-blue-100 text-blue-700'
  if (code === 'basic') return 'bg-violet-100 text-violet-700'
  if (code === 'pro') return 'bg-emerald-100 text-emerald-700'
  return 'bg-gray-100 text-gray-600'
}

function deriveStatus(
  school: School,
  subscriptions: SchoolSubscriptionHistory[]
): { label: string; className: string } {
  if (school.isSuspended) return { label: 'Suspended', className: 'bg-red-100 text-red-700' }
  const active = subscriptions.find((s) => s.status === 'active')
  if (!active || !active.endDate)
    return { label: 'No Subscription', className: 'bg-gray-100 text-gray-500' }
  const daysLeft = Math.ceil((new Date(active.endDate).getTime() - Date.now()) / 86400000)
  if (daysLeft < 0) return { label: 'Expired', className: 'bg-gray-100 text-gray-500' }
  if (daysLeft <= 30) return { label: 'Expiring', className: 'bg-amber-100 text-amber-700' }
  return { label: 'Active', className: 'bg-green-100 text-green-700' }
}

function calcDuration(startDate: string, endDate: string | null): string {
  if (!endDate) return '—'
  const months = Math.round(
    (new Date(endDate).getTime() - new Date(startDate).getTime()) / (86400000 * 30)
  )
  if (months >= 12) {
    const years = Math.round(months / 12)
    return `${years} year${years > 1 ? 's' : ''}`
  }
  return `${months} month${months !== 1 ? 's' : ''}`
}

function EditModal({ school, onClose }: { school: School; onClose: () => void }) {
  const { data, setData, put, errors, processing, wasSuccessful } = useForm({
    name: school.name,
    code: school.code ?? '',
    address: school.address ?? '',
    city: school.city ?? '',
    province: school.province ?? '',
    phone: school.phone ?? '',
  })

  if (wasSuccessful) {
    onClose()
    return null
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    put(`/admin/schools/${school.id}`)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-gray-900">Edit School</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="School Name" htmlFor="edit-name" error={errors.name} required>
            <Input
              id="edit-name"
              value={data.name}
              onChange={(e) => setData('name', e.target.value)}
            />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Slug" htmlFor="edit-code" error={errors.code}>
              <Input
                id="edit-code"
                value={data.code}
                onChange={(e) => setData('code', e.target.value)}
              />
            </FormField>
            <FormField label="City" htmlFor="edit-city" error={errors.city}>
              <Input
                id="edit-city"
                value={data.city}
                onChange={(e) => setData('city', e.target.value)}
              />
            </FormField>
          </div>
          <FormField label="Address" htmlFor="edit-address" error={errors.address}>
            <Input
              id="edit-address"
              value={data.address}
              onChange={(e) => setData('address', e.target.value)}
            />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Phone" htmlFor="edit-phone" error={errors.phone}>
              <Input
                id="edit-phone"
                value={data.phone}
                onChange={(e) => setData('phone', e.target.value)}
              />
            </FormField>
            <FormField label="Province" htmlFor="edit-province" error={errors.province}>
              <select
                id="edit-province"
                value={data.province}
                onChange={(e) => setData('province', e.target.value)}
                className="w-full h-9 border border-input rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="">Select province</option>
                <option value="Punjab">Punjab</option>
                <option value="Sindh">Sindh</option>
                <option value="KPK">KPK</option>
                <option value="Balochistan">Balochistan</option>
                <option value="Other">Other</option>
              </select>
            </FormField>
          </div>
          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              disabled={processing}
              className="bg-violet-600 hover:bg-violet-700 text-white"
            >
              {processing ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function AdminSchoolsShowPage({
  school,
  subscriptions,
  studentsCount,
  primaryAdmin,
}: {
  school: School
  subscriptions: SchoolSubscriptionHistory[]
  studentsCount: number
  primaryAdmin: { name: string; email: string } | null
}) {
  const [showEditModal, setShowEditModal] = useState(false)

  const activeSub = subscriptions.find((s) => s.status === 'active')
  const status = deriveStatus(school, subscriptions)

  const daysRemaining = activeSub?.endDate
    ? Math.ceil((new Date(activeSub.endDate).getTime() - Date.now()) / 86400000)
    : null

  const daysColor =
    daysRemaining === null
      ? 'text-gray-500'
      : daysRemaining > 30
        ? 'text-green-600'
        : daysRemaining > 10
          ? 'text-amber-600'
          : 'text-red-600'

  const maxStudents = activeSub?.maxStudents ?? null
  const enrollPct = maxStudents ? Math.min((studentsCount / maxStudents) * 100, 100) : 0

  return (
    <>
      <Head title={school.name} />

      {showEditModal && <EditModal school={school} onClose={() => setShowEditModal(false)} />}

      <div className="space-y-5">
        {/* Back + title */}
        <div className="flex items-center gap-3">
          <Link
            href="/admin/subscriptions"
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="font-semibold text-gray-900">School Details</h1>
        </div>

        {/* Identity card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-violet-100 flex items-center justify-center text-violet-700 text-xl font-bold shrink-0">
              {getInitials(school.name)}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-gray-900">{school.name}</h2>
              {(school.city || school.province) && (
                <p className="text-sm text-gray-500 mt-0.5">
                  {[school.city, school.province].filter(Boolean).join(', ')}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {school.isSuspended ? (
                <button
                  onClick={() => router.post(`/admin/schools/${school.id}/activate`)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                >
                  <CheckCircle size={16} />
                  Activate
                </button>
              ) : (
                <button
                  onClick={() => router.post(`/admin/schools/${school.id}/suspend`)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors"
                >
                  <Ban size={16} />
                  Suspend
                </button>
              )}
              <button
                onClick={() => setShowEditModal(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
              >
                <Pencil size={16} />
                Edit
              </button>
            </div>
          </div>
        </div>

        {/* Row 1: Info + Subscription */}
        <div className="grid grid-cols-3 gap-5">
          <div className="col-span-2 bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">School Information</h3>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              {[
                { label: 'School Name', value: school.name },
                { label: 'Slug', value: school.code, mono: true },
                { label: 'City', value: school.city || '—' },
                { label: 'Province', value: school.province || '—' },
                { label: 'Address', value: school.address || '—' },
              ].map(({ label, value, mono }) => (
                <div key={label}>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">{label}</p>
                  <p className={`text-sm text-gray-700 ${mono ? 'font-mono' : ''}`}>
                    {value || '—'}
                  </p>
                </div>
              ))}
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Status</p>
                <span
                  className={`px-2 py-0.5 text-xs rounded-full font-medium ${status.className}`}
                >
                  {status.label}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Joined</p>
                <p className="text-sm text-gray-700">{formatDate(school.createdAt)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Subscription</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Current Plan</p>
                {activeSub?.plan ? (
                  <span
                    className={`px-2 py-0.5 text-xs rounded font-medium ${planBadgeClass(activeSub.plan.code)}`}
                  >
                    {activeSub.plan.name}
                  </span>
                ) : (
                  <span className="text-sm text-gray-400">None</span>
                )}
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Expires On</p>
                <p className="text-sm font-medium text-gray-900">
                  {formatDate(activeSub?.endDate)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Days Remaining</p>
                <p className={`text-sm font-medium ${daysColor}`}>
                  {daysRemaining !== null ? `${daysRemaining} days` : '—'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Admin + Students */}
        <div className="grid grid-cols-3 gap-5">
          <div className="col-span-2 bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">School Admin</h3>
            {primaryAdmin ? (
              <div className="grid grid-cols-3 gap-x-8 gap-y-4">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Admin Name</p>
                  <p className="text-sm font-medium text-gray-900">{primaryAdmin.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Admin Email</p>
                  <p className="text-sm text-gray-700">{primaryAdmin.email}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                    Contact Number
                  </p>
                  <p className="text-sm text-gray-700">{school.phone || '—'}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-400">No admin assigned</p>
            )}
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Students</h3>
            <div>
              <div className="flex items-end justify-between mb-1.5">
                <p className="text-xs text-gray-400 uppercase tracking-wide">Enrolled</p>
                <p className="text-sm font-semibold text-gray-900">
                  {studentsCount.toLocaleString()}
                  {maxStudents && (
                    <span className="text-gray-400 font-normal">
                      {' '}
                      / {maxStudents.toLocaleString()}
                    </span>
                  )}
                </p>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="bg-violet-500 rounded-full h-2 transition-all"
                  style={{ width: `${enrollPct}%` }}
                />
              </div>
              {maxStudents && (
                <p
                  className={`text-xs mt-1.5 ${enrollPct >= 80 ? 'text-amber-600' : 'text-gray-400'}`}
                >
                  {maxStudents - studentsCount} seats remaining
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Subscription History */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Subscription History</h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Complete record of all subscription periods for this school
              </p>
            </div>
            <span className="px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
              {subscriptions.length} records
            </span>
          </div>
          <Table className="text-sm">
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                {['#', 'Plan', 'Start Date', 'End Date', 'Duration', 'Status', 'Notes'].map((h) => (
                  <TableHead
                    key={h}
                    className="px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide"
                  >
                    {h}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscriptions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="px-6 py-8 text-center text-gray-400">
                    No subscription history
                  </TableCell>
                </TableRow>
              ) : (
                subscriptions.map((sub, i) => (
                  <TableRow key={sub.id}>
                    <TableCell className="px-6 py-4 text-gray-400 text-xs">{i + 1}</TableCell>
                    <TableCell className="px-6 py-4">
                      {sub.plan ? (
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded ${planBadgeClass(sub.plan.code)}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${sub.plan.code === 'trial' ? 'bg-blue-500' : sub.plan.code === 'basic' ? 'bg-violet-500' : 'bg-gray-400'}`}
                          />
                          {sub.plan.name}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">—</span>
                      )}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-gray-700">
                      {formatDate(sub.startDate)}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-gray-700">
                      {formatDate(sub.endDate)}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-gray-500 text-xs">
                      {calcDuration(sub.startDate, sub.endDate)}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {sub.status === 'active' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-500 rounded-full">
                          {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-xs text-gray-400">
                      {sub.notes || '—'}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  )
}

AdminSchoolsShowPage.layout = (page: ReactElement) => <SuperAdminLayout>{page}</SuperAdminLayout>

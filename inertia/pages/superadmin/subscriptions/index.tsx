import { type ReactElement, useState, useMemo } from 'react'
import { Head, useForm, Link } from '@inertiajs/react'
import SuperAdminLayout from '~/layouts/SuperAdminLayout'
import { Check, Clock, Pencil, X } from 'lucide-react'
import type { SubscriptionPlan, SchoolSubscription } from '~/types'
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '~/components/ui/table'

function formatDate(dateStr: string | null) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function planBadgeClass(code: string | null) {
  if (code === 'trial') return 'bg-blue-100 text-blue-700'
  if (code === 'basic') return 'bg-violet-100 text-violet-700'
  if (code === 'pro') return 'bg-emerald-100 text-emerald-700'
  return 'bg-gray-100 text-gray-600'
}

function statusBadgeClass(status: string) {
  if (status === 'active') return 'bg-green-100 text-green-700'
  if (status === 'expiring') return 'bg-amber-100 text-amber-700'
  if (status === 'expired') return 'bg-gray-100 text-gray-500'
  if (status === 'suspended') return 'bg-red-100 text-red-700'
  return 'bg-gray-100 text-gray-500'
}

function isExpiringSoon(endDate: string | null) {
  if (!endDate) return false
  const days = Math.ceil((new Date(endDate).getTime() - Date.now()) / 86400000)
  return days >= 0 && days <= 14
}

type EditPlanForm = {
  name: string
  description: string | null
  priceMonthly: number
  priceYearly: number
  maxStudents: number
  maxStaff: number
}

function EditPlanModal({
  plan,
  onClose,
}: {
  plan: SubscriptionPlan
  onClose: () => void
}) {
  const { data, setData, put, processing, errors } = useForm<EditPlanForm>({
    name: plan.name,
    description: plan.description ?? '',
    priceMonthly: plan.priceMonthly,
    priceYearly: plan.priceYearly,
    maxStudents: plan.maxStudents,
    maxStaff: plan.maxStaff,
  })

  function submit(e: React.FormEvent) {
    e.preventDefault()
    put(`/admin/plans/${plan.id}`, { onSuccess: onClose })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-gray-900">Edit Plan — {plan.name}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Plan Name</label>
            <input
              type="text"
              value={data.name}
              onChange={(e) => setData('name', e.target.value)}
              className="w-full h-9 rounded-lg border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Monthly Price (PKR)</label>
            <input
              type="number"
              value={data.priceMonthly}
              onChange={(e) => setData('priceMonthly', Number(e.target.value))}
              className="w-full h-9 rounded-lg border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
            {errors.priceMonthly && <p className="text-xs text-red-500 mt-1">{errors.priceMonthly}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Annual Price (PKR)</label>
            <input
              type="number"
              value={data.priceYearly}
              onChange={(e) => setData('priceYearly', Number(e.target.value))}
              className="w-full h-9 rounded-lg border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
            {errors.priceYearly && <p className="text-xs text-red-500 mt-1">{errors.priceYearly}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Max Students</label>
              <input
                type="number"
                value={data.maxStudents}
                onChange={(e) => setData('maxStudents', Number(e.target.value))}
                className="w-full h-9 rounded-lg border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Max Staff</label>
              <input
                type="number"
                value={data.maxStaff}
                onChange={(e) => setData('maxStaff', Number(e.target.value))}
                className="w-full h-9 rounded-lg border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
            <textarea
              rows={2}
              value={data.description ?? ''}
              onChange={(e) => setData('description', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700">
            Included modules are determined by the plan configuration in code. Contact a developer
            to add or remove modules.
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={processing}
              className="px-4 py-2 text-sm font-medium bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors disabled:opacity-60"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const PLAN_FEATURES = [
  'Academic Structure',
  'Student Management',
  'Staff & HR',
  'Attendance',
  'Fee Management',
  'Reports',
]

function PlanCard({
  plan,
  schoolsOnPlan,
  onEdit,
}: {
  plan: SubscriptionPlan
  schoolsOnPlan: number
  onEdit: () => void
}) {
  const isTrial = plan.code === 'trial'
  const isPro = plan.code === 'pro'
  const isBasic = plan.code === 'basic'

  if (isPro) {
    return (
      <div className="bg-white rounded-xl border border-dashed border-gray-300 p-5 relative opacity-75">
        <div className="absolute -top-3 left-5">
          <span className="px-2.5 py-0.5 text-xs bg-amber-400 text-amber-900 rounded-full font-medium">
            Coming Soon
          </span>
        </div>
        <div className="mb-4 mt-2">
          <h3 className="font-bold text-gray-400 text-lg">{plan.name}</h3>
          <p className="text-sm text-gray-400 mt-0.5">Reserved for future modules</p>
        </div>
        <div className="mb-4">
          <span className="text-3xl font-bold text-gray-300">TBD</span>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-gray-400">
            <Check className="w-4 h-4 text-gray-300 shrink-0" />
            Everything in Basic
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <Clock className="w-4 h-4 text-gray-300 shrink-0" />
            Future modules (not yet defined)
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
          <span className="text-sm text-gray-400">No schools yet</span>
          <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-400 rounded-full font-medium">
            Inactive
          </span>
        </div>
      </div>
    )
  }

  const borderClass = isBasic ? 'border-2 border-violet-500' : 'border border-gray-200'
  const badgeClass = isTrial
    ? 'bg-emerald-500 text-white'
    : 'bg-violet-600 text-white'
  const badgeLabel = isTrial ? 'Free' : 'Continuation'
  const checkColor = isTrial ? 'text-emerald-500' : 'text-violet-500'
  const titleColor = isBasic ? 'text-violet-700' : 'text-gray-900'
  const activeTagClass = isBasic ? 'bg-violet-100 text-violet-700' : 'bg-emerald-100 text-emerald-700'

  return (
    <div className={`bg-white rounded-xl ${borderClass} p-5 relative`}>
      <div className="absolute -top-3 left-5">
        <span className={`px-2.5 py-0.5 text-xs rounded-full font-medium ${badgeClass}`}>
          {badgeLabel}
        </span>
      </div>
      <div className="flex items-start justify-between mb-4 mt-2">
        <div>
          <h3 className={`font-bold text-lg ${titleColor}`}>{plan.name}</h3>
          <p className="text-sm text-gray-500 mt-0.5">{plan.description ?? ''}</p>
        </div>
        {isBasic && (
          <button
            onClick={onEdit}
            className="p-1.5 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
          >
            <Pencil className="w-4 h-4" />
          </button>
        )}
      </div>
      <div className="mb-4">
        {isTrial ? (
          <span className="text-3xl font-bold text-emerald-600">Free</span>
        ) : (
          <>
            <span className="text-3xl font-bold text-gray-900">
              PKR {plan.priceYearly.toLocaleString()}
            </span>
            <span className="text-gray-500 text-sm">/year</span>
          </>
        )}
      </div>
      <div className="space-y-2 text-sm">
        {PLAN_FEATURES.map((f) => (
          <div key={f} className="flex items-center gap-2 text-gray-700">
            <Check className={`w-4 h-4 shrink-0 ${checkColor}`} />
            {f}
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
        <span className="text-sm text-gray-500">
          <span className="font-semibold text-gray-900">{schoolsOnPlan}</span> schools
        </span>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${activeTagClass}`}>
          Active
        </span>
      </div>
    </div>
  )
}

export default function SubscriptionsIndexPage({
  plans,
  subscriptions,
  planCounts,
}: {
  plans: SubscriptionPlan[]
  subscriptions: SchoolSubscription[]
  planCounts: Record<string, number>
}) {
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null)
  const [planFilter, setPlanFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const filtered = useMemo(() => {
    return subscriptions.filter((s) => {
      if (planFilter && s.plan?.code !== planFilter) return false
      if (statusFilter && s.status !== statusFilter) return false
      return true
    })
  }, [subscriptions, planFilter, statusFilter])

  return (
    <>
      <Head title="Subscription Plans" />

      {/* Plan Cards */}
      <div className="grid grid-cols-3 gap-5 mb-8">
        {plans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            schoolsOnPlan={planCounts[plan.code] ?? 0}
            onEdit={() => setEditingPlan(plan)}
          />
        ))}
      </div>

      {/* Active Subscriptions Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900 text-sm">Active Subscriptions</h2>
          <div className="flex items-center gap-3">
            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              className="h-8 border border-gray-300 rounded-lg text-xs px-3 text-gray-600 focus:outline-none"
            >
              <option value="">All Plans</option>
              {plans.map((p) => (
                <option key={p.id} value={p.code}>
                  {p.name}
                </option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-8 border border-gray-300 rounded-lg text-xs px-3 text-gray-600 focus:outline-none"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="expiring">Expiring</option>
              <option value="expired">Expired</option>
            </select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="py-10 text-center text-sm text-gray-400">No subscriptions found</div>
        ) : (
          <Table className="text-sm">
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                <TableHead className="px-5 py-3 text-gray-500">School</TableHead>
                <TableHead className="px-5 py-3 text-gray-500 text-center">Plan</TableHead>
                <TableHead className="px-5 py-3 text-gray-500 text-center">Amount</TableHead>
                <TableHead className="px-5 py-3 text-gray-500 text-center">Started</TableHead>
                <TableHead className="px-5 py-3 text-gray-500 text-center">Expires</TableHead>
                <TableHead className="px-5 py-3 text-gray-500 text-center">Status</TableHead>
                <TableHead className="px-5 py-3 text-gray-500 text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((sub) => {
                const expiring = isExpiringSoon(sub.endDate)
                return (
                  <TableRow key={sub.id}>
                    <TableCell className="px-5 py-3 font-medium text-gray-900">
                      {sub.school ? (
                        <Link
                          href={`/admin/schools/${sub.school.id}`}
                          className="hover:text-violet-600 transition-colors"
                        >
                          {sub.school.name}
                        </Link>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </TableCell>
                    <TableCell className="px-5 py-3 text-center">
                      {sub.plan ? (
                        <span
                          className={`px-2 py-0.5 text-xs rounded font-medium ${planBadgeClass(sub.plan.code)}`}
                        >
                          {sub.plan.name}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">—</span>
                      )}
                    </TableCell>
                    <TableCell className="px-5 py-3 text-center">
                      {sub.customPrice != null ? (
                        <span className="font-semibold text-gray-900">
                          PKR {sub.customPrice.toLocaleString()}
                        </span>
                      ) : sub.plan?.code === 'trial' ? (
                        <span className="text-gray-400">Free</span>
                      ) : sub.plan?.priceYearly ? (
                        <span className="font-semibold text-gray-900">
                          PKR {sub.plan.priceYearly.toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </TableCell>
                    <TableCell className="px-5 py-3 text-gray-500 text-center">{formatDate(sub.startDate)}</TableCell>
                    <TableCell
                      className={`px-5 py-3 text-center ${expiring ? 'text-red-600 font-medium' : 'text-gray-500'}`}
                    >
                      {formatDate(sub.endDate)}
                    </TableCell>
                    <TableCell className="px-5 py-3 text-center">
                      <span
                        className={`px-2 py-0.5 text-xs rounded-full font-medium ${statusBadgeClass(sub.status)}`}
                      >
                        {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell className="px-5 py-3 text-center">
                      {sub.school && (
                        <Link
                          href={`/admin/schools/${sub.school.id}`}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                        >
                          Manage
                        </Link>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </div>

      {editingPlan && (
        <EditPlanModal plan={editingPlan} onClose={() => setEditingPlan(null)} />
      )}
    </>
  )
}

SubscriptionsIndexPage.layout = (page: ReactElement) => <SuperAdminLayout>{page}</SuperAdminLayout>

import { type ReactElement, useState, useMemo } from 'react'
import { Head, Link, useForm, router } from '@inertiajs/react'
import SuperAdminLayout from '~/layouts/SuperAdminLayout'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import { FormField } from '~/components/FormField'
import { Plus, Search, X } from 'lucide-react'
import type { SchoolListItem, SubscriptionPlan } from '~/types'
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '~/components/ui/table'

function getInitials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
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

function formatDate(dateStr: string | null | undefined) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function AddSchoolModal({ onClose }: { onClose: () => void }) {
  const { data, setData, post, errors, processing, wasSuccessful } = useForm({
    name: '',
    code: '',
    address: '',
    phone: '',
    city: '',
    province: '',
    adminFirstName: '',
    adminLastName: '',
    adminEmail: '',
  })

  if (wasSuccessful) {
    onClose()
    return null
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    post('/admin/schools')
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-gray-900">Add New School</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
            School Info
          </p>
          <FormField label="School Name" htmlFor="name" error={errors.name} required>
            <Input
              id="name"
              value={data.name}
              onChange={(e) => setData('name', e.target.value)}
              placeholder="e.g., Al-Noor Academy"
            />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Slug" htmlFor="code" error={errors.code}>
              <Input
                id="code"
                value={data.code}
                onChange={(e) => setData('code', e.target.value)}
                placeholder="al-noor"
              />
            </FormField>
            <FormField label="City" htmlFor="city" error={errors.city}>
              <Input
                id="city"
                value={data.city}
                onChange={(e) => setData('city', e.target.value)}
                placeholder="Lahore"
              />
            </FormField>
          </div>
          <FormField label="Address" htmlFor="address" error={errors.address}>
            <Input
              id="address"
              value={data.address}
              onChange={(e) => setData('address', e.target.value)}
              placeholder="123 Main Street"
            />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Phone" htmlFor="phone" error={errors.phone}>
              <Input
                id="phone"
                value={data.phone}
                onChange={(e) => setData('phone', e.target.value)}
                placeholder="+92 300 1234567"
              />
            </FormField>
            <FormField label="Province" htmlFor="province" error={errors.province}>
            <select
              id="province"
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

          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide pt-2">
            Initial Admin
          </p>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="First Name" htmlFor="adminFirstName" error={errors.adminFirstName} required>
              <Input
                id="adminFirstName"
                value={data.adminFirstName}
                onChange={(e) => setData('adminFirstName', e.target.value)}
                placeholder="Ahmed"
              />
            </FormField>
            <FormField label="Last Name" htmlFor="adminLastName" error={errors.adminLastName}>
              <Input
                id="adminLastName"
                value={data.adminLastName}
                onChange={(e) => setData('adminLastName', e.target.value)}
                placeholder="Khan"
              />
            </FormField>
          </div>
          <FormField label="Admin Email" htmlFor="adminEmail" error={errors.adminEmail} required>
            <Input
              id="adminEmail"
              type="email"
              value={data.adminEmail}
              onChange={(e) => setData('adminEmail', e.target.value)}
              placeholder="admin@school.com"
            />
          </FormField>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-700">
            New schools are automatically assigned a 3-month Trial subscription.
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={processing} className="bg-violet-600 hover:bg-violet-700 text-white">
              {processing ? 'Creating...' : 'Create School'}
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

function DeleteConfirmModal({
  school,
  onClose,
}: {
  school: SchoolListItem
  onClose: () => void
}) {
  const [processing, setProcessing] = useState(false)

  function handleConfirm() {
    setProcessing(true)
    router.delete(`/admin/schools/${school.id}`, { onFinish: onClose })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Delete School</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>
        <p className="text-sm text-gray-600 mb-1">
          Are you sure you want to delete{' '}
          <span className="font-semibold text-gray-900">{school.name}</span>?
        </p>
        <p className="text-sm text-red-600 mb-6">This action cannot be undone.</p>
        <div className="flex gap-3 justify-end">
          <Button type="button" variant="outline" onClick={onClose} disabled={processing}>
            Cancel
          </Button>
          <Button
            type="button"
            disabled={processing}
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={handleConfirm}
          >
            {processing ? 'Deleting...' : 'Delete School'}
          </Button>
        </div>
      </div>
    </div>
  )
}

function ExtendModal({
  school,
  onClose,
}: {
  school: SchoolListItem
  onClose: () => void
}) {
  const { data, setData, post, errors, processing, wasSuccessful } = useForm({
    endDate: '',
    notes: '',
  })

  if (wasSuccessful) {
    onClose()
    return null
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    post(`/admin/schools/${school.id}/extend`)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-gray-900">Extend Subscription</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-4 space-y-1 text-sm">
          <p>
            <span className="text-gray-500">School:</span>{' '}
            <span className="font-medium text-gray-900">{school.name}</span>
          </p>
          <p>
            <span className="text-gray-500">Plan:</span>{' '}
            <span className="font-medium">{school.subscription?.planName || '—'}</span>
          </p>
          <p>
            <span className="text-gray-500">Current expiry:</span>{' '}
            <span className="font-medium">{formatDate(school.subscription?.endDate)}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="New End Date" htmlFor="endDate" error={errors.endDate} required>
            <Input
              id="endDate"
              type="date"
              value={data.endDate}
              onChange={(e) => setData('endDate', e.target.value)}
            />
          </FormField>
          <FormField label="Notes (optional)" htmlFor="notes" error={errors.notes}>
            <textarea
              id="notes"
              value={data.notes}
              onChange={(e) => setData('notes', e.target.value)}
              rows={3}
              placeholder="Reason for extension..."
              className="w-full border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
            />
          </FormField>
          <div className="flex gap-3">
            <Button type="submit" disabled={processing} className="bg-violet-600 hover:bg-violet-700 text-white">
              {processing ? 'Extending...' : 'Extend Subscription'}
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

export default function AdminSchoolsIndexPage({
  schools,
  plans,
}: {
  schools: SchoolListItem[]
  plans: SubscriptionPlan[]
}) {
  const [showAddModal, setShowAddModal] = useState(false)
  const [extendTarget, setExtendTarget] = useState<SchoolListItem | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<SchoolListItem | null>(null)
  const [search, setSearch] = useState('')
  const [filterPlan, setFilterPlan] = useState('')
  const [filterProvince, setFilterProvince] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  const filtered = useMemo(() => {
    return schools.filter((s) => {
      if (
        search &&
        !s.name.toLowerCase().includes(search.toLowerCase()) &&
        !(s.code?.toLowerCase().includes(search.toLowerCase())) &&
        !(s.city?.toLowerCase().includes(search.toLowerCase()))
      )
        return false
      if (filterPlan && s.subscription?.planCode !== filterPlan) return false
      if (filterProvince && s.province !== filterProvince) return false
      if (filterStatus && s.status !== filterStatus) return false
      return true
    })
  }, [schools, search, filterPlan, filterProvince, filterStatus])


  return (
    <>
      <Head title="Schools" />

      {showAddModal && (
        <AddSchoolModal onClose={() => setShowAddModal(false)} />
      )}
      {extendTarget && (
        <ExtendModal school={extendTarget} onClose={() => setExtendTarget(null)} />
      )}
      {deleteTarget && (
        <DeleteConfirmModal school={deleteTarget} onClose={() => setDeleteTarget(null)} />
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="font-semibold text-gray-900 text-lg">Schools</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 text-sm font-medium bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors flex items-center gap-2"
        >
          <Plus size={16} />
          Add School
        </button>
      </div>

      {/* Filter bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-5 flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search schools..."
            className="pl-9 h-9"
          />
        </div>
        <select
          value={filterPlan}
          onChange={(e) => setFilterPlan(e.target.value)}
          className="h-9 border border-gray-300 rounded-lg text-sm px-3 text-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500"
        >
          <option value="">All Plans</option>
          {plans.map((p) => (
            <option key={p.id} value={p.code}>
              {p.name}
            </option>
          ))}
        </select>
        <select
          value={filterProvince}
          onChange={(e) => setFilterProvince(e.target.value)}
          className="h-9 border border-gray-300 rounded-lg text-sm px-3 text-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500"
        >
          <option value="">All Provinces</option>
          <option value="Punjab">Punjab</option>
          <option value="Sindh">Sindh</option>
          <option value="KPK">KPK</option>
          <option value="Balochistan">Balochistan</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="h-9 border border-gray-300 rounded-lg text-sm px-3 text-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="expiring">Expiring</option>
          <option value="expired">Expired</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200">
        <Table className="text-sm">
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              <TableHead className="px-5 py-3 text-gray-500">School</TableHead>
              <TableHead className="px-5 py-3 text-gray-500 text-center">Slug</TableHead>
              <TableHead className="px-5 py-3 text-gray-500 text-center">Plan</TableHead>
              <TableHead className="px-5 py-3 text-gray-500 text-center">Students</TableHead>
              <TableHead className="px-5 py-3 text-gray-500 text-center">Admin</TableHead>
              <TableHead className="px-5 py-3 text-gray-500 text-center">Status</TableHead>
              <TableHead className="px-5 py-3 text-gray-500 text-center">Expires</TableHead>
              <TableHead className="px-5 py-3 text-gray-500 text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="px-5 py-10 text-center text-gray-400">
                  No schools found
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((school) => (
                <TableRow
                  key={school.id}
                  className="cursor-pointer"
                  onClick={() => router.visit(`/admin/schools/${school.id}`)}
                >
                  <TableCell className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center text-violet-700 text-xs font-bold shrink-0">
                        {getInitials(school.name)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{school.name}</p>
                        {(school.city || school.province) && (
                          <p className="text-xs text-gray-500">
                            {[school.city, school.province].filter(Boolean).join(', ')}
                          </p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-5 py-3 text-gray-500 font-mono text-xs text-center">
                    {school.code || '—'}
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
                  <TableCell className="px-5 py-3 text-gray-600 text-center">
                    {school.primaryAdmin?.name || '—'}
                  </TableCell>
                  <TableCell className="px-5 py-3 text-center">
                    <span
                      className={`px-2 py-0.5 text-xs rounded-full font-medium ${statusBadgeClass(school.status)}`}
                    >
                      {school.status.charAt(0).toUpperCase() + school.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell className="px-5 py-3 text-gray-500 text-xs text-center">
                    {formatDate(school.subscription?.endDate)}
                  </TableCell>
                  <TableCell className="px-5 py-3" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-1.5 justify-center">
                      <button
                        onClick={() => router.post(`/admin/schools/${school.id}/enter`)}
                        className="px-2.5 py-1 text-xs font-medium text-violet-600 bg-violet-50 hover:bg-violet-100 rounded transition-colors"
                      >
                        Enter
                      </button>
                      <button
                        onClick={() => setExtendTarget(school)}
                        className="px-2.5 py-1 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded transition-colors"
                      >
                        Extend
                      </button>
                      {school.subscription?.planCode === 'trial' && (
                        <Link
                          href={`/admin/schools/${school.id}/subscription`}
                          className="px-2.5 py-1 text-xs font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded transition-colors"
                        >
                          Convert
                        </Link>
                      )}
                      {school.studentsCount === 0 && (
                        <button
                          onClick={() => setDeleteTarget(school)}
                          className="px-2.5 py-1 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded transition-colors"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </>
  )
}

AdminSchoolsIndexPage.layout = (page: ReactElement) => <SuperAdminLayout>{page}</SuperAdminLayout>

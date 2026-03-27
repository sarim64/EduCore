import { type ReactElement, useState } from 'react'
import { Head, router } from '@inertiajs/react'
import DashboardLayout from '~/layouts/DashboardLayout'
import { X } from 'lucide-react'
import type { SchoolAuditLog, PaginationMeta } from '~/types'
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '~/components/ui/table'

function actionBadgeClass(action: string) {
  if (action === 'create') return 'bg-emerald-100 text-emerald-700'
  if (action === 'update') return 'bg-amber-100 text-amber-700'
  if (action === 'delete') return 'bg-red-100 text-red-700'
  if (action === 'login') return 'bg-blue-100 text-blue-700'
  if (action === 'logout') return 'bg-gray-100 text-gray-600'
  if (action === 'payment') return 'bg-violet-100 text-violet-700'
  return 'bg-gray-100 text-gray-600'
}

function formatTimestamp(dateStr: string) {
  return new Date(dateStr)
    .toLocaleString('en-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
    .replace(',', '')
}

function DetailModal({ log, onClose }: { log: SchoolAuditLog; onClose: () => void }) {
  const oldKeys = log.oldValues ? Object.keys(log.oldValues) : []
  const newKeys = log.newValues ? Object.keys(log.newValues) : []
  const allKeys = [...new Set([...oldKeys, ...newKeys])]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-gray-900">Log Entry Detail</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Timestamp</span>
            <span className="font-mono text-gray-900">{formatTimestamp(log.createdAt)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">User</span>
            <div className="text-right">
              <span className="text-gray-900">
                {log.user
                  ? `${log.user.firstName} ${log.user.lastName ?? ''}`.trim()
                  : 'System'}
              </span>
              {log.user && (
                <div className="text-gray-500 text-xs">{log.user.email}</div>
              )}
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Action</span>
            <span
              className={`px-2 py-0.5 rounded text-xs font-medium ${actionBadgeClass(log.action)}`}
            >
              {log.action}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Resource</span>
            <span className="text-gray-900 text-right">
              {log.entityType}
              {log.entityId && <span className="text-gray-500"> — {log.entityId}</span>}
            </span>
          </div>
          {log.description && (
            <div className="flex justify-between">
              <span className="text-gray-500">Description</span>
              <span className="text-gray-700 text-right max-w-xs">{log.description}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-500">IP Address</span>
            <span className="font-mono text-gray-900">{log.ipAddress ?? '—'}</span>
          </div>
          {log.userAgent && (
            <div className="flex justify-between">
              <span className="text-gray-500">User Agent</span>
              <span className="text-gray-600 text-xs text-right max-w-xs">{log.userAgent}</span>
            </div>
          )}

          {allKeys.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-gray-500 mb-2">Changes</p>
              <div className="bg-gray-50 rounded-lg p-3 font-mono text-xs text-gray-700 space-y-1">
                {allKeys.map((key) => {
                  const oldVal = log.oldValues?.[key]
                  const newVal = log.newValues?.[key]
                  if (oldVal === newVal) return null
                  return (
                    <div key={key}>
                      {oldVal !== undefined && (
                        <div className="text-red-500">
                          - {key}: "{String(oldVal)}"
                        </div>
                      )}
                      {newVal !== undefined && (
                        <div className="text-green-600">
                          + {key}: "{String(newVal)}"
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

type Props = {
  logs: {
    data: SchoolAuditLog[]
    meta: PaginationMeta
  }
  filters: {
    search: string | null
    action: string | null
    from: string | null
    to: string | null
  }
}

function buildPageUrl(page: number, filters: Props['filters']) {
  const params = new URLSearchParams()
  params.set('page', String(page))
  if (filters.search) params.set('search', filters.search)
  if (filters.action) params.set('action', filters.action)
  if (filters.from) params.set('from', filters.from)
  if (filters.to) params.set('to', filters.to)
  return `/audit-logs?${params.toString()}`
}

export default function SchoolAuditLogsIndexPage({ logs, filters }: Props) {
  const [selectedLog, setSelectedLog] = useState<SchoolAuditLog | null>(null)
  const [search, setSearch] = useState(filters.search ?? '')
  const [action, setAction] = useState(filters.action ?? '')
  const [from, setFrom] = useState(filters.from ?? '')
  const [to, setTo] = useState(filters.to ?? '')

  function applyFilters() {
    const params: Record<string, string> = {}
    if (search) params.search = search
    if (action) params.action = action
    if (from) params.from = from
    if (to) params.to = to
    router.get('/audit-logs', params, { preserveState: true })
  }

  function clearFilters() {
    setSearch('')
    setAction('')
    setFrom('')
    setTo('')
    router.get('/audit-logs', {}, { preserveState: false })
  }

  const hasActiveFilters = filters.search || filters.action || filters.from || filters.to

  return (
    <>
      <Head title="Audit Logs" />

      {/* Filter bar */}
      <div className="mb-4 bg-white rounded-xl border border-gray-200 p-4 flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-48">
          <label className="block text-xs text-gray-500 mb-1">Search</label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
            placeholder="Search by user, action, or IP..."
            className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>
        <div className="min-w-40">
          <label className="block text-xs text-gray-500 mb-1">Action</label>
          <select
            value={action}
            onChange={(e) => setAction(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
          >
            <option value="">All Actions</option>
            <option value="login">login</option>
            <option value="logout">logout</option>
            <option value="create">create</option>
            <option value="update">update</option>
            <option value="delete">delete</option>
            <option value="payment">payment</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">From</label>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">To</label>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>
        <button
          onClick={applyFilters}
          className="px-4 py-1.5 text-sm font-medium bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
        >
          Apply
        </button>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="px-4 py-1.5 text-sm font-medium border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* Log Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {logs.data.length === 0 ? (
          <div className="py-10 text-center text-sm text-gray-400">No audit logs found</div>
        ) : (
          <>
            <Table className="text-sm">
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50">
                  <TableHead className="px-5 py-3 text-gray-500">Timestamp</TableHead>
                  <TableHead className="px-5 py-3 text-gray-500">User</TableHead>
                  <TableHead className="px-5 py-3 text-gray-500">Action</TableHead>
                  <TableHead className="px-5 py-3 text-gray-500">Resource</TableHead>
                  <TableHead className="px-5 py-3 text-gray-500">IP Address</TableHead>
                  <TableHead className="px-5 py-3 text-gray-500">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="font-mono text-xs">
                {logs.data.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="px-5 py-3 text-gray-500">
                      {formatTimestamp(log.createdAt)}
                    </TableCell>
                    <TableCell className="px-5 py-3 font-sans font-medium text-gray-900">
                      {log.user
                        ? `${log.user.firstName} ${log.user.lastName ?? ''}`.trim()
                        : 'System'}
                    </TableCell>
                    <TableCell className="px-5 py-3">
                      <span
                        className={`px-2 py-0.5 rounded font-medium ${actionBadgeClass(log.action)}`}
                      >
                        {log.action}
                      </span>
                    </TableCell>
                    <TableCell className="px-5 py-3 font-sans text-gray-700 max-w-xs truncate">
                      {log.entityType} — {log.description ?? log.entityId ?? '—'}
                    </TableCell>
                    <TableCell className="px-5 py-3 text-gray-500">
                      {log.ipAddress ?? '—'}
                    </TableCell>
                    <TableCell className="px-5 py-3">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors font-sans"
                      >
                        Details
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="border-t border-gray-100 px-5 py-3 flex items-center justify-between">
              <span className="text-sm text-gray-500">
                Showing {(logs.meta.currentPage - 1) * logs.meta.perPage + 1}–
                {Math.min(logs.meta.currentPage * logs.meta.perPage, logs.meta.total)} of{' '}
                {logs.meta.total} log entries
              </span>
              {logs.meta.lastPage > 1 && (
                <div className="flex gap-1">
                  {logs.meta.currentPage > 1 && (
                    <a
                      href={buildPageUrl(logs.meta.currentPage - 1, filters)}
                      className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      Previous
                    </a>
                  )}
                  {Array.from({ length: Math.min(logs.meta.lastPage, 5) }, (_, i) => {
                    const page = i + 1
                    return (
                      <a
                        key={page}
                        href={buildPageUrl(page, filters)}
                        className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                          page === logs.meta.currentPage
                            ? 'bg-violet-600 text-white'
                            : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </a>
                    )
                  })}
                  {logs.meta.currentPage < logs.meta.lastPage && (
                    <a
                      href={buildPageUrl(logs.meta.currentPage + 1, filters)}
                      className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      Next
                    </a>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {selectedLog && <DetailModal log={selectedLog} onClose={() => setSelectedLog(null)} />}
    </>
  )
}

SchoolAuditLogsIndexPage.layout = (page: ReactElement) => (
  <DashboardLayout>{page}</DashboardLayout>
)

import { type ReactElement, useState } from 'react'
import { Head, router } from '@inertiajs/react'
import DashboardLayout from '~/layouts/DashboardLayout'
import type { SchoolAuditLog, PaginationMeta } from '~/types'
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '~/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
import { formatTimestamp } from '~/lib/audit-log'

function actionBadgeClass(action: string) {
  if (action === 'create') return 'bg-emerald-100 text-emerald-700'
  if (action === 'update') return 'bg-amber-100 text-amber-700'
  if (action === 'delete') return 'bg-red-100 text-red-700'
  if (action === 'login') return 'bg-blue-100 text-blue-700'
  if (action === 'logout') return 'bg-gray-100 text-gray-600'
  if (action === 'payment') return 'bg-violet-100 text-violet-700'
  return 'bg-gray-100 text-gray-600'
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

  function navigateToPage(page: number) {
    router.get(buildPageUrl(page, filters), {}, { preserveState: true })
  }

  const hasActiveFilters = filters.search || filters.action || filters.from || filters.to

  const { currentPage, lastPage, perPage, total } = logs.meta
  const pageWindowStart = Math.max(1, currentPage - 2)
  const pageWindowEnd = Math.min(lastPage, pageWindowStart + 4)

  const selectedLogOldKeys = selectedLog?.oldValues ? Object.keys(selectedLog.oldValues) : []
  const selectedLogNewKeys = selectedLog?.newValues ? Object.keys(selectedLog.newValues) : []
  const selectedLogAllKeys = [...new Set([...selectedLogOldKeys, ...selectedLogNewKeys])]

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
                Showing {(currentPage - 1) * perPage + 1}–
                {Math.min(currentPage * perPage, total)} of {total} log entries
              </span>
              {lastPage > 1 && (
                <div className="flex gap-1">
                  {currentPage > 1 && (
                    <button
                      onClick={() => navigateToPage(currentPage - 1)}
                      className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      Previous
                    </button>
                  )}
                  {Array.from({ length: pageWindowEnd - pageWindowStart + 1 }, (_, i) => {
                    const page = pageWindowStart + i
                    return (
                      <button
                        key={page}
                        onClick={() => navigateToPage(page)}
                        className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                          page === currentPage
                            ? 'bg-violet-600 text-white'
                            : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    )
                  })}
                  {currentPage < lastPage && (
                    <button
                      onClick={() => navigateToPage(currentPage + 1)}
                      className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      Next
                    </button>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Detail Dialog */}
      <Dialog open={selectedLog !== null} onOpenChange={(open) => !open && setSelectedLog(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Log Entry Detail</DialogTitle>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Timestamp</span>
                <span className="font-mono text-gray-900">{formatTimestamp(selectedLog.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">User</span>
                <div className="text-right">
                  <span className="text-gray-900">
                    {selectedLog.user
                      ? `${selectedLog.user.firstName} ${selectedLog.user.lastName ?? ''}`.trim()
                      : 'System'}
                  </span>
                  {selectedLog.user && (
                    <div className="text-gray-500 text-xs">{selectedLog.user.email}</div>
                  )}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Action</span>
                <span
                  className={`px-2 py-0.5 rounded text-xs font-medium ${actionBadgeClass(selectedLog.action)}`}
                >
                  {selectedLog.action}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Resource</span>
                <span className="text-gray-900 text-right">
                  {selectedLog.entityType}
                  {selectedLog.entityId && <span className="text-gray-500"> — {selectedLog.entityId}</span>}
                </span>
              </div>
              {selectedLog.description && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Description</span>
                  <span className="text-gray-700 text-right max-w-xs">{selectedLog.description}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500">IP Address</span>
                <span className="font-mono text-gray-900">{selectedLog.ipAddress ?? '—'}</span>
              </div>
              {selectedLog.userAgent && (
                <div className="flex justify-between">
                  <span className="text-gray-500">User Agent</span>
                  <span className="text-gray-600 text-xs text-right max-w-xs">{selectedLog.userAgent}</span>
                </div>
              )}
              {selectedLogAllKeys.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-gray-500 mb-2">Changes</p>
                  <div className="bg-gray-50 rounded-lg p-3 font-mono text-xs text-gray-700 space-y-1">
                    {selectedLogAllKeys.map((key) => {
                      const oldVal = selectedLog.oldValues?.[key]
                      const newVal = selectedLog.newValues?.[key]
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
              <div className="flex justify-end pt-2">
                <Button variant="outline" onClick={() => setSelectedLog(null)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

SchoolAuditLogsIndexPage.layout = (page: ReactElement) => (
  <DashboardLayout>{page}</DashboardLayout>
)

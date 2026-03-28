import { type ReactElement, useState } from 'react'
import { Head, Link } from '@inertiajs/react'
import SuperAdminLayout from '~/layouts/SuperAdminLayout'
import { X } from 'lucide-react'
import type { AuditLog, PaginationMeta } from '~/types'
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '~/components/ui/table'
import { formatTimestamp } from '~/lib/audit-log'

function actionBadgeClass(action: string) {
  if (action === 'create' || action === 'create_school' || action === 'add_admin') {
    return 'bg-emerald-100 text-emerald-700'
  }
  if (action === 'update' || action === 'update_school' || action === 'assign_subscription' || action === 'extend_subscription') {
    return 'bg-amber-100 text-amber-700'
  }
  if (action === 'delete' || action === 'delete_school' || action === 'remove_admin') {
    return 'bg-red-100 text-red-700'
  }
  if (action === 'suspend') {
    return 'bg-red-100 text-red-700'
  }
  if (action === 'activate') {
    return 'bg-violet-100 text-violet-700'
  }
  if (action === 'login') {
    return 'bg-blue-100 text-blue-700'
  }
  if (action === 'logout') {
    return 'bg-gray-100 text-gray-600'
  }
  return 'bg-gray-100 text-gray-600'
}


function DetailModal({ log, onClose }: { log: AuditLog; onClose: () => void }) {
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
            <span className="text-gray-500">Actor</span>
            <span className="text-gray-900">
              {log.superAdmin?.user
                ? `${log.superAdmin.user.firstName} ${log.superAdmin.user.lastName ?? ''}`.trim()
                : 'Unknown'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Action</span>
            <span
              className={`px-2 py-0.5 rounded text-xs font-medium ${actionBadgeClass(log.action)}`}
            >
              {log.action}
            </span>
          </div>
          {log.targetSchool && (
            <div className="flex justify-between">
              <span className="text-gray-500">School</span>
              <span className="text-gray-900">{log.targetSchool.name}</span>
            </div>
          )}
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

export default function AdminAuditLogsIndexPage({
  logs,
}: {
  logs: { data: AuditLog[]; meta: PaginationMeta }
}) {
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null)

  return (
    <>
      <Head title="Audit Logs" />

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
                  <TableHead className="px-5 py-3 text-gray-500">Actor</TableHead>
                  <TableHead className="px-5 py-3 text-gray-500">Action</TableHead>
                  <TableHead className="px-5 py-3 text-gray-500">Description</TableHead>
                  <TableHead className="px-5 py-3 text-gray-500">School</TableHead>
                  <TableHead className="px-5 py-3 text-gray-500">IP Address</TableHead>
                  <TableHead className="px-5 py-3 text-gray-500">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="font-mono text-xs">
                {logs.data.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="px-5 py-3 text-gray-500">{formatTimestamp(log.createdAt)}</TableCell>
                    <TableCell className="px-5 py-3 font-sans font-medium text-gray-900">
                      {log.superAdmin?.user
                        ? `${log.superAdmin.user.firstName} ${log.superAdmin.user.lastName ?? ''}`.trim()
                        : 'Unknown'}
                    </TableCell>
                    <TableCell className="px-5 py-3">
                      <span
                        className={`px-2 py-0.5 rounded font-medium ${actionBadgeClass(log.action)}`}
                      >
                        {log.action}
                      </span>
                    </TableCell>
                    <TableCell className="px-5 py-3 font-sans text-gray-700 max-w-xs truncate">
                      {log.description ?? '—'}
                    </TableCell>
                    <TableCell className="px-5 py-3 font-sans text-gray-700">
                      {log.targetSchool ? (
                        <Link
                          href={`/admin/schools/${log.targetSchool.id}`}
                          className="hover:text-violet-600 transition-colors"
                        >
                          {log.targetSchool.name}
                        </Link>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </TableCell>
                    <TableCell className="px-5 py-3 text-gray-500">{log.ipAddress ?? '—'}</TableCell>
                    <TableCell className="px-5 py-3 text-right">
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
                    <Link
                      href={`/admin/audit-logs?page=${logs.meta.currentPage - 1}`}
                      className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      Previous
                    </Link>
                  )}
                  {Array.from({ length: Math.min(logs.meta.lastPage, 5) }, (_, i) => {
                    const page = i + 1
                    return (
                      <Link
                        key={page}
                        href={`/admin/audit-logs?page=${page}`}
                        className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                          page === logs.meta.currentPage
                            ? 'bg-violet-600 text-white'
                            : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </Link>
                    )
                  })}
                  {logs.meta.currentPage < logs.meta.lastPage && (
                    <Link
                      href={`/admin/audit-logs?page=${logs.meta.currentPage + 1}`}
                      className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      Next
                    </Link>
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

AdminAuditLogsIndexPage.layout = (page: ReactElement) => <SuperAdminLayout>{page}</SuperAdminLayout>

import { type ReactElement } from 'react'
import { Head } from '@inertiajs/react'
import AdminLayout from '~/layouts/AdminLayout'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'
import { Badge } from '~/components/ui/badge'
import type { AuditLog, PaginationMeta } from '~/types'

const actionLabels: Record<
  string,
  { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }
> = {
  create_school: { label: 'Created School', variant: 'default' },
  update_school: { label: 'Updated School', variant: 'secondary' },
  delete_school: { label: 'Deleted School', variant: 'destructive' },
  add_admin: { label: 'Added Admin', variant: 'default' },
  remove_admin: { label: 'Removed Admin', variant: 'destructive' },
}

export default function AdminAuditLogsIndexPage({
  logs,
}: {
  logs: { data: AuditLog[]; meta: PaginationMeta }
}) {
  return (
    <>
      <Head title="Audit Logs" />

      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-foreground)]">Audit Logs</h1>
          <p className="text-[var(--color-muted-foreground)] mt-1">
            Track all administrative actions in the system
          </p>
        </div>

        {/* Table */}
        <div className="bg-[var(--color-card)] rounded-lg border border-[var(--color-border)] overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-[var(--color-border)] bg-[var(--color-muted)]">
                <TableHead className="text-[var(--color-muted-foreground)]">Date</TableHead>
                <TableHead className="text-[var(--color-muted-foreground)]">Admin</TableHead>
                <TableHead className="text-[var(--color-muted-foreground)]">Action</TableHead>
                <TableHead className="text-[var(--color-muted-foreground)]">Description</TableHead>
                <TableHead className="text-[var(--color-muted-foreground)]">IP Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.data.length === 0 ? (
                <TableRow className="border-[var(--color-border)]">
                  <TableCell
                    colSpan={5}
                    className="text-center text-[var(--color-muted-foreground)] py-8"
                  >
                    No audit logs found.
                  </TableCell>
                </TableRow>
              ) : (
                logs.data.map((log) => {
                  const actionInfo = actionLabels[log.action] || {
                    label: log.action,
                    variant: 'outline' as const,
                  }
                  return (
                    <TableRow
                      key={log.id}
                      className="border-[var(--color-border)] hover:bg-[var(--color-muted)]"
                    >
                      <TableCell className="text-[var(--color-muted-foreground)]">
                        {new Date(log.createdAt).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-[var(--color-foreground)]">
                        {log.superAdmin?.user
                          ? `${log.superAdmin.user.firstName} ${log.superAdmin.user.lastName || ''}`
                          : 'Unknown'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={actionInfo.variant}>{actionInfo.label}</Badge>
                      </TableCell>
                      <TableCell className="text-[var(--color-muted-foreground)] max-w-md truncate">
                        {log.description || '-'}
                      </TableCell>
                      <TableCell className="text-[var(--color-muted-foreground)]">
                        {log.ipAddress || '-'}
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {logs.meta.lastPage > 1 && (
          <div className="flex justify-center gap-2 text-[var(--color-muted-foreground)]">
            <span>
              Page {logs.meta.currentPage} of {logs.meta.lastPage}
            </span>
            <span>({logs.meta.total} total records)</span>
          </div>
        )}
      </div>
    </>
  )
}

AdminAuditLogsIndexPage.layout = (page: ReactElement) => <AdminLayout>{page}</AdminLayout>

import { type ReactElement } from 'react'
import { Head, Link, router } from '@inertiajs/react'
import AdminLayout from '~/layouts/AdminLayout'
import { Button } from '~/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'
import type { User, School } from '~/types'

export default function AdminSchoolAdminsIndexPage({
  school,
  admins,
}: {
  school: School
  admins: User[]
}) {
  const handleRemove = (admin: User) => {
    if (
      confirm(
        `Are you sure you want to remove "${admin.firstName} ${admin.lastName}" as admin of this school?`
      )
    ) {
      router.delete(`/admin/schools/${school.id}/admins/${admin.id}`)
    }
  }

  return (
    <>
      <Head title={`${school.name} - Admins`} />

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Link
              href={`/admin/schools/${school.id}`}
              className="text-[color:var(--primary)] hover:text-[color:var(--primary-foreground-link)] text-sm"
            >
              ← Back to {school.name}
            </Link>
            <h1 className="text-3xl font-bold text-[color:var(--foreground)] mt-2">
              School Admins
            </h1>
            <p className="text-[color:var(--muted-foreground)] mt-1">
              Manage administrators for {school.name}
            </p>
          </div>
          <Link href={`/admin/schools/${school.id}/admins/create`}>
            <Button>Add Admin</Button>
          </Link>
        </div>

        <div className="bg-[color:var(--card)] rounded-lg border border-[color:var(--border)] overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-[color:var(--border)] hover:bg-[color:var(--card)]">
                <TableHead className="text-[color:var(--muted-foreground)]">Name</TableHead>
                <TableHead className="text-[color:var(--muted-foreground)]">Email</TableHead>
                <TableHead className="text-[color:var(--muted-foreground)]">Added</TableHead>
                <TableHead className="text-[color:var(--muted-foreground)] text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {admins.length === 0 ? (
                <TableRow className="border-[color:var(--border)]">
                  <TableCell
                    colSpan={4}
                    className="text-center text-[color:var(--muted-foreground)] py-8"
                  >
                    No admins assigned to this school yet.
                  </TableCell>
                </TableRow>
              ) : (
                admins.map((admin) => (
                  <TableRow
                    key={admin.id}
                    className="border-[color:var(--border)] hover:bg-[color:var(--card)]"
                  >
                    <TableCell className="text-[color:var(--foreground)] font-medium">
                      {admin.firstName} {admin.lastName}
                    </TableCell>
                    <TableCell className="text-[color:var(--muted-foreground)]">
                      {admin.email}
                    </TableCell>
                    <TableCell className="text-[color:var(--muted-foreground)]">
                      {admin.createdAt ? new Date(admin.createdAt).toLocaleDateString() : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-[color:var(--destructive)] hover:text-[color:var(--destructive-foreground)]"
                        onClick={() => handleRemove(admin)}
                      >
                        Remove
                      </Button>
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

AdminSchoolAdminsIndexPage.layout = (page: ReactElement) => <AdminLayout>{page}</AdminLayout>

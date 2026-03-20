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
import type { School } from '~/types'

export default function AdminSchoolsIndexPage({ schools }: { schools: School[] }) {
  const handleDelete = (school: School) => {
    if (
      confirm(`Are you sure you want to delete "${school.name}"? This action cannot be undone.`)
    ) {
      router.delete(`/admin/schools/${school.id}`)
    }
  }

  const handleEnterSchool = (school: School) => {
    router.post(`/admin/schools/${school.id}/enter`)
  }

  return (
    <>
      <Head title="Manage Schools" />

      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-foreground)]">Schools</h1>
            <p className="text-[var(--color-muted-foreground)] mt-1">
              Manage all schools in the system
            </p>
          </div>
          <Link href="/admin/schools/create">
            <Button>Create School</Button>
          </Link>
        </div>

        {/* Schools Table */}
        <div className="bg-[var(--color-card)] rounded-lg border border-[var(--color-border)] overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-[var(--color-border)] bg-[var(--color-muted)]">
                <TableHead className="text-[var(--color-muted-foreground)]">Name</TableHead>
                <TableHead className="text-[var(--color-muted-foreground)]">Code</TableHead>
                <TableHead className="text-[var(--color-muted-foreground)]">Admins</TableHead>
                <TableHead className="text-[var(--color-muted-foreground)]">Created</TableHead>
                <TableHead className="text-[var(--color-muted-foreground)] text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schools.length === 0 ? (
                <TableRow className="border-[var(--color-border)]">
                  <TableCell
                    colSpan={5}
                    className="text-center text-[var(--color-muted-foreground)] py-8"
                  >
                    No schools found. Create your first school to get started.
                  </TableCell>
                </TableRow>
              ) : (
                schools.map((school) => (
                  <TableRow
                    key={school.id}
                    className="border-[var(--color-border)] hover:bg-[var(--color-muted)]"
                  >
                    <TableCell className="text-[var(--color-foreground)] font-medium">
                      {school.name}
                    </TableCell>
                    <TableCell className="text-[var(--color-muted-foreground)]">
                      {school.code || '-'}
                    </TableCell>
                    <TableCell className="text-[var(--color-muted-foreground)]">
                      <Link
                        href={`/admin/schools/${school.id}/admins`}
                        className="text-[var(--color-primary)] hover:opacity-90"
                      >
                        {school.users?.length || 0} admin(s)
                      </Link>
                    </TableCell>
                    <TableCell className="text-[var(--color-muted-foreground)]">
                      {new Date(school.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right flex gap-2 justify-end">
                      <Button variant="ghost" size="sm" onClick={() => handleEnterSchool(school)}>
                        Enter
                      </Button>
                      <Link href={`/admin/schools/${school.id}`}>
                        <Button variant="secondary" size="sm">
                          View
                        </Button>
                      </Link>
                      <Link href={`/admin/schools/${school.id}/edit`}>
                        <Button variant="secondary" size="sm">
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-[var(--color-destructive)] hover:opacity-90"
                        onClick={() => handleDelete(school)}
                      >
                        Delete
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

AdminSchoolsIndexPage.layout = (page: ReactElement) => <AdminLayout>{page}</AdminLayout>

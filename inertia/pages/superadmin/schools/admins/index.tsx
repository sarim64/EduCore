import { type ReactElement } from 'react'
import { Head, Link, router } from '@inertiajs/react'
import SuperAdminLayout from '~/layouts/SuperAdminLayout'
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
              className="text-primary hover:text-(--primary-foreground-link) text-sm"
            >
              ← Back to {school.name}
            </Link>
            <h1 className="text-3xl font-bold text-foreground mt-2">School Admins</h1>
            <p className="text-muted-foreground mt-1">Manage administrators for {school.name}</p>
          </div>
          <Link href={`/admin/schools/${school.id}/admins/create`}>
            <Button>Add Admin</Button>
          </Link>
        </div>

        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-card">
                <TableHead className="text-muted-foreground">Name</TableHead>
                <TableHead className="text-muted-foreground">Email</TableHead>
                <TableHead className="text-muted-foreground">Added</TableHead>
                <TableHead className="text-muted-foreground text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {admins.length === 0 ? (
                <TableRow className="border-border">
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                    No admins assigned to this school yet.
                  </TableCell>
                </TableRow>
              ) : (
                admins.map((admin) => (
                  <TableRow key={admin.id} className="border-border hover:bg-card">
                    <TableCell className="text-foreground font-medium">
                      {admin.firstName} {admin.lastName}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{admin.email}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {admin.createdAt ? new Date(admin.createdAt).toLocaleDateString() : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-(--destructive-foreground)"
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

AdminSchoolAdminsIndexPage.layout = (page: ReactElement) => (
  <SuperAdminLayout>{page}</SuperAdminLayout>
)

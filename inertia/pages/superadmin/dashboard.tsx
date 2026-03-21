import { type ReactElement } from 'react'
import { Head, Link } from '@inertiajs/react'
import AdminLayout from '~/layouts/AdminLayout'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'
import { Button } from '~/components/ui/button'
import type { AdminDashboardStats, AdminSchoolStats } from '~/types'

export default function AdminDashboardPage({
  stats,
  schools,
}: {
  stats: AdminDashboardStats
  schools: AdminSchoolStats[]
}) {
  return (
    <>
      <Head title="Admin Dashboard" />

      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold text-[var(--color-foreground)]">Admin Dashboard</h1>
          <p className="text-muted-foreground">System-wide overview and administration</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Schools
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-end justify-between">
              <div className="text-3xl font-semibold">{stats.schoolsCount}</div>
              <Link href="/admin/schools" className="text-sm text-primary hover:underline">
                View all →
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Students
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold">{stats.totalStudents}</div>
              <p className="text-xs text-muted-foreground mt-1">Across all schools</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Enrollments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold">{stats.totalEnrollments}</div>
              <p className="text-xs text-muted-foreground mt-1">Currently enrolled</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Super Admins
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold">{stats.superAdminsCount}</div>
              <p className="text-xs text-muted-foreground mt-1">Active administrators</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Schools Table */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base font-semibold">Schools Overview</CardTitle>
              <Link href="/admin/schools" className="text-sm text-primary hover:underline">
                View all
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              {schools.length === 0 ? (
                <div className="py-10 text-center text-muted-foreground">
                  No schools registered yet
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>School</TableHead>
                      <TableHead className="text-right">Students</TableHead>
                      <TableHead className="text-right">Enrollments</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {schools.map((school) => (
                      <TableRow key={school.id} className="hover:bg-muted/40 transition-colors">
                        <TableCell className="font-medium">
                          <Link
                            href={`/admin/schools/${school.id}`}
                            className="hover:text-primary transition-colors"
                          >
                            {school.name}
                          </Link>
                        </TableCell>
                        <TableCell className="text-right tabular-nums text-muted-foreground">
                          {school.studentsCount}
                        </TableCell>
                        <TableCell className="text-right tabular-nums text-muted-foreground">
                          {school.enrollmentsCount}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full justify-start">
                <Link href="/admin/schools/create">＋ Create New School</Link>
              </Button>
              <Button asChild className="w-full justify-start" variant="secondary">
                <Link href="/admin/audit-logs">View Audit Logs</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}

AdminDashboardPage.layout = (page: ReactElement) => <AdminLayout>{page}</AdminLayout>

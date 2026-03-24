import { ReactElement } from 'react'
import { Head, Link } from '@inertiajs/react'
import DashboardLayout from '~/layouts/DashboardLayout'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'

export default function AttendanceIndexPage() {
  return (
    <>
      <Head title="Attendance Management" />

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Attendance Management</h1>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Student Attendance */}
          <Card>
            <CardHeader>
              <CardTitle>Student Attendance</CardTitle>
              <CardDescription>Mark and track student attendance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/attendance/students" className="block">
                <Button variant="outline" className="w-full justify-start">
                  View Student Attendance
                </Button>
              </Link>
              <Link href="/attendance/students/mark" className="block">
                <Button variant="outline" className="w-full justify-start">
                  Mark Single Attendance
                </Button>
              </Link>
              <Link href="/attendance/students/bulk-mark" className="block">
                <Button variant="outline" className="w-full justify-start">
                  Bulk Mark Class Attendance
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Staff Attendance */}
          <Card>
            <CardHeader>
              <CardTitle>Staff Attendance</CardTitle>
              <CardDescription>Track staff presence and check-in times</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/attendance/staff" className="block">
                <Button variant="outline" className="w-full justify-start">
                  View Staff Attendance
                </Button>
              </Link>
              <Link href="/attendance/staff/mark" className="block">
                <Button variant="outline" className="w-full justify-start">
                  Mark Staff Attendance
                </Button>
              </Link>
              <Link href="/attendance/staff/bulk-mark" className="block">
                <Button variant="outline" className="w-full justify-start">
                  Bulk Mark Staff Attendance
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Leave Management */}
          <Card>
            <CardHeader>
              <CardTitle>Leave Management</CardTitle>
              <CardDescription>Handle leave applications and types</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/attendance/leaves" className="block">
                <Button variant="outline" className="w-full justify-start">
                  Leave Applications
                </Button>
              </Link>
              <Link href="/attendance/leaves/apply" className="block">
                <Button variant="outline" className="w-full justify-start">
                  Apply for Leave
                </Button>
              </Link>
              <Link href="/attendance/leaves/pending" className="block">
                <Button variant="outline" className="w-full justify-start">
                  Pending Approvals
                </Button>
              </Link>
              <Link href="/attendance/leave-types" className="block">
                <Button variant="outline" className="w-full justify-start">
                  Manage Leave Types
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Reports */}
          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
              <CardDescription>Attendance reports and analytics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/attendance/reports" className="block">
                <Button variant="outline" className="w-full justify-start">
                  Reports Dashboard
                </Button>
              </Link>
              <Link href="/attendance/reports/daily" className="block">
                <Button variant="outline" className="w-full justify-start">
                  Daily Report
                </Button>
              </Link>
              <Link href="/attendance/reports/monthly" className="block">
                <Button variant="outline" className="w-full justify-start">
                  Monthly Report
                </Button>
              </Link>
              <Link href="/attendance/reports/summary" className="block">
                <Button variant="outline" className="w-full justify-start">
                  Summary Report
                </Button>
              </Link>
              <Link href="/attendance/reports/calendar" className="block">
                <Button variant="outline" className="w-full justify-start">
                  Calendar View
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}

AttendanceIndexPage.layout = (page: ReactElement) => <DashboardLayout>{page}</DashboardLayout>

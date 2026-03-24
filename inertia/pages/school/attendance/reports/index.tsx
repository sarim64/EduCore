import { ReactElement } from 'react'
import { Head, Link } from '@inertiajs/react'
import DashboardLayout from '~/layouts/DashboardLayout'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import type { ClassWithSections } from '~/types/academics'

export default function AttendanceReportsIndexPage({ classes }: { classes: ClassWithSections[] }) {
  return (
    <>
      <Head title="Attendance Reports" />

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Attendance Reports</h1>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Daily Report</CardTitle>
              <CardDescription>View attendance for a specific date</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/attendance/reports/daily">
                <Button className="w-full">View Daily Report</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Report</CardTitle>
              <CardDescription>View attendance summary for a month</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/attendance/reports/monthly">
                <Button className="w-full">View Monthly Report</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Summary Report</CardTitle>
              <CardDescription>School-wide attendance overview</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/attendance/reports/summary">
                <Button className="w-full">View Summary</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Calendar View</CardTitle>
              <CardDescription>Visual calendar of attendance</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/attendance/reports/calendar">
                <Button className="w-full">View Calendar</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
            <CardDescription>Total classes: {classes.length}</CardDescription>
          </CardHeader>
          <CardContent>
            {classes.length === 0 ? (
              <p className="text-gray-500">No classes found. Please create classes first.</p>
            ) : (
              <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
                {classes.slice(0, 8).map((cls) => (
                  <div key={cls.id} className="p-4 border rounded-lg">
                    <h3 className="font-medium">{cls.name}</h3>
                    <p className="text-sm text-gray-500">
                      {cls.sections.length} section{cls.sections.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}

AttendanceReportsIndexPage.layout = (page: ReactElement) => (
  <DashboardLayout>{page}</DashboardLayout>
)

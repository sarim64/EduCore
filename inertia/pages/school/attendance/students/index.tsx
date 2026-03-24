import { ReactElement } from 'react'
import { Head, Link } from '@inertiajs/react'
import DashboardLayout from '~/layouts/DashboardLayout'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'

import type { SchoolClass, AcademicYear } from '~/types/academics'

export default function StudentAttendanceIndexPage({
  classes,
}: {
  classes: SchoolClass[]
  academicYears: AcademicYear[]
}) {
  return (
    <>
      <Head title="Student Attendance" />

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Student Attendance</h1>
          <div className="flex gap-2">
            <Link href="/attendance/students/mark">
              <Button>Mark Attendance</Button>
            </Link>
            <Link href="/attendance/students/bulk-mark">
              <Button variant="outline">Bulk Mark by Class</Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/attendance/students/mark" className="block">
                <Button variant="outline" className="w-full justify-start">
                  Mark Single Student Attendance
                </Button>
              </Link>
              <Link href="/attendance/students/bulk-mark" className="block">
                <Button variant="outline" className="w-full justify-start">
                  Mark Class Attendance (Bulk)
                </Button>
              </Link>
              <Link href="/attendance/reports/daily" className="block">
                <Button variant="outline" className="w-full justify-start">
                  View Daily Report
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Classes</CardTitle>
            </CardHeader>
            <CardContent>
              {classes.length === 0 ? (
                <p className="text-gray-500">No classes found.</p>
              ) : (
                <ul className="space-y-2">
                  {classes.map((cls) => (
                    <li key={cls.id}>
                      <Link
                        href={`/attendance/students/bulk-mark?classId=${cls.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        {cls.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}

StudentAttendanceIndexPage.layout = (page: ReactElement) => (
  <DashboardLayout>{page}</DashboardLayout>
)

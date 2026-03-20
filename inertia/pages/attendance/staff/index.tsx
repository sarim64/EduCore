import { ReactElement } from 'react'
import { Head, Link } from '@inertiajs/react'
import DashboardLayout from '~/layouts/DashboardLayout'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'

import type { StaffMember } from '~/types/staff'

export default function StaffAttendanceIndexPage({
  staffMembers,
}: {
  staffMembers: StaffMember[]
}) {
  return (
    <>
      <Head title="Staff Attendance" />

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Staff Attendance</h1>
          <div className="flex gap-2">
            <Link href="/attendance/staff/mark">
              <Button>Mark Attendance</Button>
            </Link>
            <Link href="/attendance/staff/bulk-mark">
              <Button variant="outline">Bulk Mark</Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/attendance/staff/mark" className="block">
                <Button variant="outline" className="w-full justify-start">
                  Mark Single Staff Attendance
                </Button>
              </Link>
              <Link href="/attendance/staff/bulk-mark" className="block">
                <Button variant="outline" className="w-full justify-start">
                  Mark All Staff Attendance (Bulk)
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Active Staff ({staffMembers.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {staffMembers.length === 0 ? (
                <p className="text-gray-500">No active staff members found.</p>
              ) : (
                <ul className="space-y-2 max-h-60 overflow-y-auto">
                  {staffMembers.slice(0, 10).map((staff) => (
                    <li key={staff.id} className="flex justify-between items-center">
                      <Link
                        href={`/attendance/staff/${staff.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        {staff.firstName} {staff.lastName}
                      </Link>
                      <span className="text-sm text-gray-500">{staff.staffMemberId}</span>
                    </li>
                  ))}
                  {staffMembers.length > 10 && (
                    <li className="text-sm text-gray-500">
                      And {staffMembers.length - 10} more...
                    </li>
                  )}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}

StaffAttendanceIndexPage.layout = (page: ReactElement) => <DashboardLayout>{page}</DashboardLayout>

import { ReactElement } from 'react'
import { Head, Link } from '@inertiajs/react'
import DashboardLayout from '~/layouts/DashboardLayout'
import { Badge } from '~/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'

import type { StaffAttendanceHistoryRecord } from '~/types/attendance'
import type { StaffMember } from '~/types/staff'

export default function StaffAttendanceHistoryPage({
  staff,
  attendances,
}: {
  staff: StaffMember
  attendances: StaffAttendanceHistoryRecord[]
}) {
  function getStatusColor(status: string) {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800'
      case 'absent':
        return 'bg-red-100 text-red-800'
      case 'late':
        return 'bg-yellow-100 text-yellow-800'
      case 'on_leave':
        return 'bg-blue-100 text-blue-800'
      case 'half_day':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  function formatStatus(status: string) {
    return status.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())
  }

  return (
    <>
      <Head title={`Attendance History - ${staff.firstName} ${staff.lastName || ''}`} />

      <div className="space-y-6">
        <div className="mb-6">
          <Link href="/attendance/staff" className="text-blue-600 hover:underline">
            &larr; Back to Staff Attendance
          </Link>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">
              {staff.firstName} {staff.lastName}
            </h1>
            <p className="text-gray-600">Staff ID: {staff.staffMemberId}</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Attendance History</CardTitle>
          </CardHeader>
          <CardContent>
            {attendances.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No attendance records found.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Check-in</TableHead>
                    <TableHead>Check-out</TableHead>
                    <TableHead>Remarks</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendances.map((attendance) => (
                    <TableRow key={attendance.id}>
                      <TableCell>{new Date(attendance.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge className={`font-normal ${getStatusColor(attendance.status)}`}>
                          {formatStatus(attendance.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>{attendance.checkInTime || '-'}</TableCell>
                      <TableCell>{attendance.checkOutTime || '-'}</TableCell>
                      <TableCell className="text-gray-600">{attendance.remarks || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}

StaffAttendanceHistoryPage.layout = (page: ReactElement) => (
  <DashboardLayout>{page}</DashboardLayout>
)

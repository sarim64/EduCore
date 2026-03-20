import { ReactElement } from 'react'
import { Head, Link } from '@inertiajs/react'
import DashboardLayout from '~/layouts/DashboardLayout'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'

import type { LeaveApplication } from '~/types/attendance'

export default function PendingLeaveApplicationsPage({
  applications,
}: {
  applications: LeaveApplication[]
}) {
  return (
    <>
      <Head title="Pending Leave Applications" />

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Pending Leave Applications</h1>
          <Link href="/attendance/leaves">
            <Button variant="outline">All Applications</Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Applications Awaiting Approval ({applications.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {applications.length === 0 ? (
              <p className="text-gray-500">No pending leave applications.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Staff</TableHead>
                    <TableHead>Staff ID</TableHead>
                    <TableHead>Leave Type</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Days</TableHead>
                    <TableHead>Applied On</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((application) => (
                    <TableRow key={application.id}>
                      <TableCell>
                        {application.staff
                          ? `${application.staff.firstName} ${application.staff.lastName ?? ''}`
                          : 'N/A'}
                      </TableCell>
                      <TableCell>{application.staff?.staffMemberId ?? 'N/A'}</TableCell>
                      <TableCell>{application.leaveType?.name ?? 'N/A'}</TableCell>
                      <TableCell>
                        {application.startDate} - {application.endDate}
                      </TableCell>
                      <TableCell>{application.totalDays}</TableCell>
                      <TableCell>{application.appliedOn}</TableCell>
                      <TableCell>
                        <Link
                          href={`/attendance/leaves/${application.id}`}
                          className="text-blue-600 hover:underline"
                        >
                          Review
                        </Link>
                      </TableCell>
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

PendingLeaveApplicationsPage.layout = (page: ReactElement) => (
  <DashboardLayout>{page}</DashboardLayout>
)

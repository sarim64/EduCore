import { ReactElement } from 'react'
import { Head, Link } from '@inertiajs/react'
import DashboardLayout from '~/layouts/DashboardLayout'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'
import type { LeaveApplication } from '~/types/attendance'

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  cancelled: 'bg-gray-100 text-gray-800',
}

export default function LeaveApplicationsIndexPage({
  applications,
}: {
  applications: LeaveApplication[]
}) {
  return (
    <>
      <Head title="Leave Applications" />

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Leave Applications</h1>
          <div className="flex gap-2">
            <Link href="/attendance/leaves/apply">
              <Button>Apply for Leave</Button>
            </Link>
            <Link href="/attendance/leaves/pending">
              <Button variant="outline">Pending Approvals</Button>
            </Link>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>My Leave Applications</CardTitle>
          </CardHeader>
          <CardContent>
            {applications.length === 0 ? (
              <p className="text-gray-500">No leave applications found.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Staff</TableHead>
                    <TableHead>Leave Type</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Days</TableHead>
                    <TableHead>Status</TableHead>
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
                      <TableCell>{application.leaveType?.name ?? 'N/A'}</TableCell>
                      <TableCell>
                        {application.startDate} - {application.endDate}
                      </TableCell>
                      <TableCell>{application.totalDays}</TableCell>
                      <TableCell>
                        <Badge
                          className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[application.status]}`}
                        >
                          {application.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{application.appliedOn}</TableCell>
                      <TableCell>
                        <Link
                          href={`/attendance/leaves/${application.id}`}
                          className="text-blue-600 hover:underline"
                        >
                          View
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

LeaveApplicationsIndexPage.layout = (page: ReactElement) => (
  <DashboardLayout>{page}</DashboardLayout>
)

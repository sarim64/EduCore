import { ReactElement, useState } from 'react'
import { Head, Link, router } from '@inertiajs/react'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { FormField } from '~/components/FormField'
import { Input } from '~/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'
import DashboardLayout from '~/layouts/DashboardLayout'
import type { StudentReport } from '~/types/attendance'

type AttendanceStudent = {
  id: string
  firstName: string
  lastName: string | null
  studentId: string | null
  className: string | null
  sectionName: string | null
}

const statusColors: Record<string, string> = {
  present: 'bg-green-100 text-green-800',
  absent: 'bg-red-100 text-red-800',
  late: 'bg-yellow-100 text-yellow-800',
  excused: 'bg-blue-100 text-blue-800',
  half_day: 'bg-orange-100 text-orange-800',
}

export default function StudentAttendanceReportPage({
  student,
  fromDate,
  toDate,
  report,
}: {
  student: AttendanceStudent
  fromDate: string
  toDate: string
  report: StudentReport
}) {
  const [startDate, setStartDate] = useState(fromDate)
  const [endDate, setEndDate] = useState(toDate)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (startDate) params.append('fromDate', startDate)
    if (endDate) params.append('toDate', endDate)
    router.get(`/attendance/reports/student/${student.id}?${params.toString()}`)
  }

  return (
    <>
      <Head title={`Attendance Report - ${student.firstName} ${student.lastName ?? ''}`} />

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Student Attendance Report</h1>
          <Link href="/attendance/reports">
            <Button variant="outline">Back to Reports</Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Student Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">
                  {student.firstName} {student.lastName}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Student ID</p>
                <p className="font-medium">{student.studentId || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Class</p>
                <p className="font-medium">{student.className || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Section</p>
                <p className="font-medium">{student.sectionName || '-'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Date Range</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 items-end">
              <FormField label="From Date" htmlFor="fromDate" className="w-48">
                <Input
                  type="date"
                  id="fromDate"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full"
                />
              </FormField>
              <FormField label="To Date" htmlFor="toDate" className="w-48">
                <Input
                  type="date"
                  id="toDate"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full"
                />
              </FormField>
              <Button type="submit">Update Report</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              Attendance Summary ({report.fromDate} to {report.toDate})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-7 gap-4 mb-6">
              <div className="p-4 bg-gray-50 rounded-lg text-center">
                <p className="text-2xl font-bold">{report.totalDays}</p>
                <p className="text-sm text-gray-500">Total Days</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg text-center">
                <p className="text-2xl font-bold text-green-600">{report.present}</p>
                <p className="text-sm text-green-600">Present</p>
              </div>
              <div className="p-4 bg-red-50 rounded-lg text-center">
                <p className="text-2xl font-bold text-red-600">{report.absent}</p>
                <p className="text-sm text-red-600">Absent</p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg text-center">
                <p className="text-2xl font-bold text-yellow-600">{report.late}</p>
                <p className="text-sm text-yellow-600">Late</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg text-center">
                <p className="text-2xl font-bold text-blue-600">{report.excused}</p>
                <p className="text-sm text-blue-600">Excused</p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg text-center">
                <p className="text-2xl font-bold text-orange-600">{report.halfDay}</p>
                <p className="text-sm text-orange-600">Half Day</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg text-center">
                <p className="text-2xl font-bold text-purple-600">{report.attendanceRate}%</p>
                <p className="text-sm text-purple-600">Rate</p>
              </div>
            </div>

            {report.records.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Remarks</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {report.records.map((record, index) => (
                    <TableRow key={index}>
                      <TableCell>{record.date}</TableCell>
                      <TableCell>
                        <Badge
                          className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[record.status] || 'bg-gray-100'}`}
                        >
                          {record.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-500">{record.remarks || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-gray-500 text-center py-8">
                No attendance records found for this period.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}

StudentAttendanceReportPage.layout = (page: ReactElement) => (
  <DashboardLayout>{page}</DashboardLayout>
)

import { ReactElement, useState } from 'react'
import { Head, Link, router } from '@inertiajs/react'
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
import type { StaffAttendanceSummary, StudentAttendanceSummary } from '~/types/attendance'

export default function AttendanceSummaryPage({
  selectedDate,
  studentSummary,
  staffSummary,
}: {
  selectedDate: string
  studentSummary: StudentAttendanceSummary
  staffSummary: StaffAttendanceSummary
}) {
  const [date, setDate] = useState(selectedDate)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    router.get(`/attendance/reports/summary?date=${date}`)
  }

  return (
    <>
      <Head title="Attendance Summary" />

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Attendance Summary</h1>
          <Link href="/attendance/reports">
            <Button variant="outline">Back to Reports</Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Select Date</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex gap-4 items-end">
              <FormField label="Date" htmlFor="date" className="w-48">
                <Input
                  type="date"
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full"
                />
              </FormField>
              <Button type="submit">View Summary</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Staff Attendance - {staffSummary.date}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg text-center">
                <p className="text-2xl font-bold">{staffSummary.totalStaff}</p>
                <p className="text-sm text-gray-500">Total Staff</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg text-center">
                <p className="text-2xl font-bold text-green-600">{staffSummary.present}</p>
                <p className="text-sm text-green-600">Present</p>
              </div>
              <div className="p-4 bg-red-50 rounded-lg text-center">
                <p className="text-2xl font-bold text-red-600">{staffSummary.absent}</p>
                <p className="text-sm text-red-600">Absent</p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg text-center">
                <p className="text-2xl font-bold text-yellow-600">{staffSummary.late}</p>
                <p className="text-sm text-yellow-600">Late</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg text-center">
                <p className="text-2xl font-bold text-blue-600">{staffSummary.onLeave}</p>
                <p className="text-sm text-blue-600">On Leave</p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg text-center">
                <p className="text-2xl font-bold text-orange-600">{staffSummary.halfDay}</p>
                <p className="text-sm text-orange-600">Half Day</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg text-center">
                <p className="text-2xl font-bold text-purple-600">{staffSummary.attendanceRate}%</p>
                <p className="text-sm text-purple-600">Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Student Attendance - {studentSummary.date}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 bg-gray-50 rounded-lg text-center">
                <p className="text-2xl font-bold">{studentSummary.totalClasses}</p>
                <p className="text-sm text-gray-500">Total Classes</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg text-center">
                <p className="text-2xl font-bold text-blue-600">{studentSummary.totalStudents}</p>
                <p className="text-sm text-blue-600">Total Students</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg text-center col-span-2">
                <p className="text-2xl font-bold text-purple-600">
                  {studentSummary.overallAttendanceRate}%
                </p>
                <p className="text-sm text-purple-600">Overall Attendance Rate</p>
              </div>
            </div>

            {studentSummary.classes.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Class</TableHead>
                    <TableHead className="text-center">Students</TableHead>
                    <TableHead className="text-center">Present</TableHead>
                    <TableHead className="text-center">Absent</TableHead>
                    <TableHead className="text-center">Late</TableHead>
                    <TableHead className="text-center">Excused</TableHead>
                    <TableHead className="text-center">Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {studentSummary.classes.map((cls) => (
                    <TableRow key={cls.classId}>
                      <TableCell className="font-medium">
                        {cls.className}
                        {cls.sectionName && ` - ${cls.sectionName}`}
                      </TableCell>
                      <TableCell className="text-center">{cls.totalStudents}</TableCell>
                      <TableCell className="text-center text-green-600">{cls.present}</TableCell>
                      <TableCell className="text-center text-red-600">{cls.absent}</TableCell>
                      <TableCell className="text-center text-yellow-600">{cls.late}</TableCell>
                      <TableCell className="text-center text-blue-600">{cls.excused}</TableCell>
                      <TableCell className="text-center font-medium">
                        {cls.attendanceRate}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-gray-500 text-center py-8">No class data available.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}

AttendanceSummaryPage.layout = (page: ReactElement) => <DashboardLayout>{page}</DashboardLayout>

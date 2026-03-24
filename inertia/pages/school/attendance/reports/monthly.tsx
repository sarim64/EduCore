import { ReactElement, useState } from 'react'
import { Head, Link, router } from '@inertiajs/react'
import { FileDown, FileSpreadsheet } from 'lucide-react'
import { exportToExcel, exportToPDF, type ExportColumn } from '~/lib/report_export'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { FormField } from '~/components/FormField'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'
import DashboardLayout from '~/layouts/DashboardLayout'
import type { ClassWithSections } from '~/types/academics'
import type { MonthlyReport } from '~/types/attendance'

const months = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' },
]

export default function MonthlyReportPage({
  classes,
  selectedClassId,
  selectedSectionId,
  selectedYear,
  selectedMonth,
  report,
}: {
  classes: ClassWithSections[]
  selectedClassId: string | null
  selectedSectionId: string | null
  selectedYear: number
  selectedMonth: number
  report: MonthlyReport | null
}) {
  const [classId, setClassId] = useState(selectedClassId || '')
  const [sectionId, setSectionId] = useState(selectedSectionId || '')
  const [year, setYear] = useState(selectedYear)
  const [month, setMonth] = useState(selectedMonth)

  const selectedClass = classes.find((c) => c.id === classId)
  const sections = selectedClass?.sections || []

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i)

  function handleExportPDF() {
    if (!report) return
    const columns: ExportColumn[] = [
      { header: 'Student ID', accessor: 'studentIdNumber', width: 20 },
      { header: 'Name', accessor: 'studentName', width: 35 },
      { header: 'Present', accessor: 'present', width: 15 },
      { header: 'Absent', accessor: 'absent', width: 15 },
      { header: 'Late', accessor: 'late', width: 12 },
      { header: 'Excused', accessor: 'excused', width: 15 },
      { header: 'Total', accessor: 'totalDays', width: 12 },
      { header: 'Rate', accessor: (row) => `${row.attendanceRate}%`, width: 15 },
    ]
    exportToPDF({
      title: 'Monthly Attendance Report',
      subtitle: `${report.className}${report.sectionName ? ` - ${report.sectionName}` : ''} | ${report.month} ${report.year}`,
      filename: `monthly-attendance-${report.month}-${report.year}`,
      columns,
      data: report.records as unknown as Record<string, unknown>[],
      orientation: 'landscape',
      summary: [
        { label: 'Total Students', value: report.totalStudents },
        { label: 'Working Days', value: report.workingDays },
        { label: 'Average Attendance Rate', value: `${report.averageAttendanceRate}%` },
      ],
    })
  }

  function handleExportExcel() {
    if (!report) return
    const columns: ExportColumn[] = [
      { header: 'Student ID', accessor: 'studentIdNumber', width: 15 },
      { header: 'Name', accessor: 'studentName', width: 25 },
      { header: 'Present', accessor: 'present', width: 10 },
      { header: 'Absent', accessor: 'absent', width: 10 },
      { header: 'Late', accessor: 'late', width: 10 },
      { header: 'Excused', accessor: 'excused', width: 10 },
      { header: 'Half Day', accessor: 'halfDay', width: 10 },
      { header: 'Total Days', accessor: 'totalDays', width: 12 },
      { header: 'Attendance Rate', accessor: 'attendanceRate', width: 15 },
    ]
    exportToExcel({
      title: `Monthly Attendance - ${report.className}${report.sectionName ? ` - ${report.sectionName}` : ''} - ${report.month} ${report.year}`,
      filename: `monthly-attendance-${report.month}-${report.year}`,
      columns,
      data: report.records as unknown as Record<string, unknown>[],
      summary: [
        { label: 'Total Students', value: report.totalStudents },
        { label: 'Working Days', value: report.workingDays },
        { label: 'Average Attendance Rate', value: `${report.averageAttendanceRate}%` },
      ],
    })
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!classId) return
    const params = new URLSearchParams()
    if (classId) params.append('classId', classId)
    if (sectionId) params.append('sectionId', sectionId)
    params.append('year', String(year))
    params.append('month', String(month))
    router.get(`/attendance/reports/monthly?${params.toString()}`)
  }

  return (
    <>
      <Head title="Monthly Attendance Report" />

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Monthly Attendance Report</h1>
          <div className="flex items-center gap-2">
            {report && (
              <>
                <Button variant="outline" onClick={handleExportPDF}>
                  <FileDown className="mr-2 h-4 w-4" />
                  PDF
                </Button>
                <Button variant="outline" onClick={handleExportExcel}>
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Excel
                </Button>
              </>
            )}
            <Link href="/attendance/reports">
              <Button variant="outline">Back to Reports</Button>
            </Link>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Select Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 items-end">
              <FormField label="Class" htmlFor="classId" required className="w-48">
                <Select
                  value={classId || 'none'}
                  onValueChange={(value) => {
                    const nextClass = value === 'none' ? '' : value
                    setClassId(nextClass)
                    setSectionId('')
                  }}
                >
                  <SelectTrigger id="classId" className="w-full">
                    <SelectValue placeholder="Select Class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Select Class</SelectItem>
                    {classes.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id}>
                        {cls.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label="Section" htmlFor="sectionId" className="w-48">
                <Select
                  value={sectionId || 'all'}
                  onValueChange={(value) => setSectionId(value === 'all' ? '' : value)}
                  disabled={!classId}
                >
                  <SelectTrigger id="sectionId" className="w-full">
                    <SelectValue placeholder="All Sections" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sections</SelectItem>
                    {sections.map((sec) => (
                      <SelectItem key={sec.id} value={sec.id}>
                        {sec.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label="Month" htmlFor="month" className="w-40">
                <Select value={String(month)} onValueChange={(value) => setMonth(Number(value))}>
                  <SelectTrigger id="month" className="w-full">
                    <SelectValue placeholder="Select Month" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((m) => (
                      <SelectItem key={m.value} value={String(m.value)}>
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label="Year" htmlFor="year" className="w-28">
                <Select value={String(year)} onValueChange={(value) => setYear(Number(value))}>
                  <SelectTrigger id="year" className="w-full">
                    <SelectValue placeholder="Select Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((y) => (
                      <SelectItem key={y} value={String(y)}>
                        {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              <Button type="submit" disabled={!classId}>
                Generate Report
              </Button>
            </form>
          </CardContent>
        </Card>

        {report && (
          <Card>
            <CardHeader>
              <CardTitle>
                {report.className} {report.sectionName && `- ${report.sectionName}`} |{' '}
                {report.month} {report.year}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <p className="text-2xl font-bold">{report.totalStudents}</p>
                  <p className="text-sm text-gray-500">Total Students</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg text-center">
                  <p className="text-2xl font-bold text-blue-600">{report.workingDays}</p>
                  <p className="text-sm text-blue-600">Working Days</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg text-center">
                  <p className="text-2xl font-bold text-purple-600">
                    {report.averageAttendanceRate}%
                  </p>
                  <p className="text-sm text-purple-600">Avg. Attendance</p>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="text-center">Present</TableHead>
                    <TableHead className="text-center">Absent</TableHead>
                    <TableHead className="text-center">Late</TableHead>
                    <TableHead className="text-center">Excused</TableHead>
                    <TableHead className="text-center">Total</TableHead>
                    <TableHead className="text-center">Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {report.records.map((record) => (
                    <TableRow key={record.studentId}>
                      <TableCell>{record.studentIdNumber || '-'}</TableCell>
                      <TableCell>{record.studentName}</TableCell>
                      <TableCell className="text-center text-green-600">{record.present}</TableCell>
                      <TableCell className="text-center text-red-600">{record.absent}</TableCell>
                      <TableCell className="text-center text-yellow-600">{record.late}</TableCell>
                      <TableCell className="text-center text-blue-600">{record.excused}</TableCell>
                      <TableCell className="text-center">{record.totalDays}</TableCell>
                      <TableCell className="text-center font-medium">
                        {record.attendanceRate}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  )
}

MonthlyReportPage.layout = (page: ReactElement) => <DashboardLayout>{page}</DashboardLayout>

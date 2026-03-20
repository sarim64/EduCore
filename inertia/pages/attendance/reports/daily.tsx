import { ReactElement, useState } from 'react'
import { Head, Link, router } from '@inertiajs/react'
import { FileDown, FileSpreadsheet } from 'lucide-react'
import { exportToExcel, exportToPDF, type ExportColumn } from '~/lib/report_export'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { FormField } from '~/components/FormField'
import { Input } from '~/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'
import DashboardLayout from '~/layouts/DashboardLayout'
import type { ClassWithSections } from '~/types/academics'
import type { DailyReport } from '~/types/attendance'

const statusColors: Record<string, string> = {
  present: 'bg-green-100 text-green-800',
  absent: 'bg-red-100 text-red-800',
  late: 'bg-yellow-100 text-yellow-800',
  excused: 'bg-blue-100 text-blue-800',
  half_day: 'bg-orange-100 text-orange-800',
}

export default function DailyReportPage({
  classes,
  selectedClassId,
  selectedSectionId,
  selectedDate,
  report,
}: {
  classes: ClassWithSections[]
  selectedClassId: string | null
  selectedSectionId: string | null
  selectedDate: string
  report: DailyReport | null
}) {
  const [classId, setClassId] = useState(selectedClassId || '')
  const [sectionId, setSectionId] = useState(selectedSectionId || '')
  const [date, setDate] = useState(selectedDate)

  const selectedClass = classes.find((c) => c.id === classId)
  const sections = selectedClass?.sections || []

  function handleExportPDF() {
    if (!report) return
    const columns: ExportColumn[] = [
      { header: 'Student ID', accessor: 'studentIdNumber', width: 25 },
      { header: 'Name', accessor: 'studentName', width: 40 },
      { header: 'Status', accessor: 'status', width: 20 },
      { header: 'Remarks', accessor: (row) => String(row.remarks || '-'), width: 35 },
    ]
    exportToPDF({
      title: 'Daily Attendance Report',
      subtitle: `${report.className}${report.sectionName ? ` - ${report.sectionName}` : ''} | ${report.date}`,
      filename: `daily-attendance-${report.date}`,
      columns,
      data: report.records as unknown as Record<string, unknown>[],
      summary: [
        { label: 'Total Students', value: report.totalStudents },
        { label: 'Present', value: report.present },
        { label: 'Absent', value: report.absent },
        { label: 'Attendance Rate', value: `${report.attendanceRate}%` },
      ],
    })
  }

  function handleExportExcel() {
    if (!report) return
    const columns: ExportColumn[] = [
      { header: 'Student ID', accessor: 'studentIdNumber', width: 20 },
      { header: 'Name', accessor: 'studentName', width: 30 },
      { header: 'Status', accessor: 'status', width: 15 },
      { header: 'Remarks', accessor: (row) => String(row.remarks || '-'), width: 30 },
    ]
    exportToExcel({
      title: `Daily Attendance - ${report.className}${report.sectionName ? ` - ${report.sectionName}` : ''} - ${report.date}`,
      filename: `daily-attendance-${report.date}`,
      columns,
      data: report.records as unknown as Record<string, unknown>[],
      summary: [
        { label: 'Total Students', value: report.totalStudents },
        { label: 'Present', value: report.present },
        { label: 'Absent', value: report.absent },
        { label: 'Attendance Rate', value: `${report.attendanceRate}%` },
      ],
    })
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!classId || !date) return
    const params = new URLSearchParams()
    if (classId) params.append('classId', classId)
    if (sectionId) params.append('sectionId', sectionId)
    if (date) params.append('date', date)
    router.get(`/attendance/reports/daily?${params.toString()}`)
  }

  return (
    <>
      <Head title="Daily Attendance Report" />

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Daily Attendance Report</h1>
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

              <FormField label="Date" htmlFor="date" required className="w-48">
                <Input
                  type="date"
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full"
                />
              </FormField>

              <Button type="submit" disabled={!classId || !date}>
                Generate Report
              </Button>
            </form>
          </CardContent>
        </Card>

        {report && (
          <Card>
            <CardHeader>
              <CardTitle>
                {report.className} {report.sectionName && `- ${report.sectionName}`} | {report.date}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <p className="text-2xl font-bold">{report.totalStudents}</p>
                  <p className="text-sm text-gray-500">Total Students</p>
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
                <div className="p-4 bg-purple-50 rounded-lg text-center">
                  <p className="text-2xl font-bold text-purple-600">{report.attendanceRate}%</p>
                  <p className="text-sm text-purple-600">Attendance Rate</p>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Remarks</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {report.records.map((record) => (
                    <TableRow key={record.studentId}>
                      <TableCell>{record.studentIdNumber || '-'}</TableCell>
                      <TableCell>{record.studentName}</TableCell>
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
            </CardContent>
          </Card>
        )}
      </div>
    </>
  )
}

DailyReportPage.layout = (page: ReactElement) => <DashboardLayout>{page}</DashboardLayout>

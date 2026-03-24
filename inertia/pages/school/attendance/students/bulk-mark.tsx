import { ReactElement, useEffect, useState } from 'react'
import { Head, Link, router, useForm } from '@inertiajs/react'
import DashboardLayout from '~/layouts/DashboardLayout'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
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

import type { AcademicYear, SchoolClass, Section } from '~/types/academics'
import type { AttendanceEntry } from '~/types/attendance'
import type { Student } from '~/types/students'

export default function BulkMarkStudentAttendancePage({
  classes,
  sections,
  currentYear,
  students,
  selectedClassId,
  selectedSectionId,
}: {
  classes: SchoolClass[]
  sections: Section[]
  academicYears: AcademicYear[]
  currentYear?: AcademicYear
  students: Student[]
  selectedClassId: string
  selectedSectionId: string
}) {
  const [classId, setClassId] = useState(selectedClassId)
  const [sectionId, setSectionId] = useState(selectedSectionId)
  const [attendances, setAttendances] = useState<AttendanceEntry[]>([])

  useEffect(() => {
    setAttendances(
      students.map((student) => ({
        studentId: student.id,
        status: 'present' as const,
        remarks: '',
      }))
    )
  }, [students])

  const { data, setData, post, errors, processing, transform } = useForm({
    classId: selectedClassId,
    sectionId: selectedSectionId || undefined,
    academicYearId: currentYear?.id || '',
    date: new Date().toISOString().split('T')[0],
    attendances: [] as AttendanceEntry[],
  })

  transform((formData) => ({
    ...formData,
    classId,
    sectionId: sectionId || undefined,
    attendances,
  }))

  function handleClassChange(newClassId: string) {
    setClassId(newClassId)
    setSectionId('')
    router.get('/attendance/students/bulk-mark', { classId: newClassId }, { preserveState: true })
  }

  function handleSectionChange(newSectionId: string) {
    setSectionId(newSectionId)
    router.get(
      '/attendance/students/bulk-mark',
      { classId, sectionId: newSectionId },
      { preserveState: true }
    )
  }

  function updateAttendance(studentId: string, field: keyof AttendanceEntry, value: string) {
    setAttendances((prev) =>
      prev.map((a) => (a.studentId === studentId ? { ...a, [field]: value } : a))
    )
  }

  function markAllAs(status: 'present' | 'absent' | 'late' | 'excused' | 'half_day') {
    setAttendances((prev) => prev.map((a) => ({ ...a, status })))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    post('/attendance/students/bulk-mark')
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'present':
        return 'bg-green-100'
      case 'absent':
        return 'bg-red-100'
      case 'late':
        return 'bg-yellow-100'
      case 'excused':
        return 'bg-blue-100'
      case 'half_day':
        return 'bg-orange-100'
      default:
        return ''
    }
  }

  return (
    <>
      <Head title="Bulk Mark Attendance" />

      <div className="space-y-6">
        <div className="mb-6">
          <Link href="/attendance/students" className="text-blue-600 hover:underline">
            &larr; Back to Student Attendance
          </Link>
        </div>

        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Bulk Mark Class Attendance</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Select Class</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <FormField label="Class" htmlFor="classId">
                <Select
                  value={classId || 'none'}
                  onValueChange={(value) => handleClassChange(value === 'none' ? '' : value)}
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

              <FormField label="Section (Optional)" htmlFor="sectionId">
                <Select
                  value={sectionId || 'all'}
                  onValueChange={(value) => handleSectionChange(value === 'all' ? '' : value)}
                  disabled={!classId}
                >
                  <SelectTrigger id="sectionId" className="w-full">
                    <SelectValue placeholder="All Sections" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sections</SelectItem>
                    {sections.map((section) => (
                      <SelectItem key={section.id} value={section.id}>
                        {section.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label="Date" htmlFor="date" error={errors.date}>
                <Input
                  id="date"
                  type="date"
                  value={data.date}
                  max={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setData('date', e.target.value)}
                />
              </FormField>
            </div>
          </CardContent>
        </Card>

        {students.length > 0 && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Students ({students.length})</CardTitle>
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => markAllAs('present')}
                >
                  All Present
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => markAllAs('absent')}
                >
                  All Absent
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Remarks</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student, index) => {
                      const attendance = attendances.find((a) => a.studentId === student.id)
                      return (
                        <TableRow
                          key={student.id}
                          className={getStatusColor(attendance?.status || '')}
                        >
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{student.fullName}</div>
                              <div className="text-sm text-gray-500">{student.studentId}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Select
                              value={attendance?.status || 'present'}
                              onValueChange={(value) =>
                                updateAttendance(student.id, 'status', value)
                              }
                            >
                              <SelectTrigger className="w-[140px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="present">Present</SelectItem>
                                <SelectItem value="absent">Absent</SelectItem>
                                <SelectItem value="late">Late</SelectItem>
                                <SelectItem value="excused">Excused</SelectItem>
                                <SelectItem value="half_day">Half Day</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Input
                              type="text"
                              value={attendance?.remarks || ''}
                              onChange={(e) =>
                                updateAttendance(student.id, 'remarks', e.target.value)
                              }
                              placeholder="Remarks..."
                            />
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>

                {(errors as Record<string, string>).general && (
                  <p className="text-sm text-red-500 mt-4">
                    {(errors as Record<string, string>).general}
                  </p>
                )}

                <div className="flex gap-2 mt-6">
                  <Button type="submit" disabled={processing}>
                    {processing ? 'Saving...' : `Save Attendance (${students.length} students)`}
                  </Button>
                  <Link href="/attendance/students">
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {classId && students.length === 0 && (
          <Card>
            <CardContent className="py-8 text-center text-gray-500">
              No students enrolled in this class for the current academic year.
            </CardContent>
          </Card>
        )}
      </div>
    </>
  )
}

BulkMarkStudentAttendancePage.layout = (page: ReactElement) => (
  <DashboardLayout>{page}</DashboardLayout>
)

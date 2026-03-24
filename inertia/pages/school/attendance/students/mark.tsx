import { ReactElement, useState } from 'react'
import { Head, Link, useForm } from '@inertiajs/react'
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

import type { AcademicYear, SchoolClass } from '~/types/academics'
import type { Student } from '~/types/students'

export default function MarkStudentAttendancePage({
  students,
  classes,
  academicYears,
  currentYear,
}: {
  students: Student[]
  classes: SchoolClass[]
  academicYears: AcademicYear[]
  currentYear?: AcademicYear
}) {
  const [searchTerm, setSearchTerm] = useState('')

  const { data, setData, post, errors, processing } = useForm({
    studentId: '',
    academicYearId: currentYear?.id || '',
    classId: '',
    date: new Date().toISOString().split('T')[0],
    status: 'present' as 'present' | 'absent' | 'late' | 'excused' | 'half_day',
    remarks: '',
  })

  const filteredStudents = students.filter(
    (student) =>
      (student.fullName ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase())
  )

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    post('/attendance/students/mark')
  }

  function selectStudent(student: Student) {
    setData('studentId', student.id)
    setSearchTerm(student.fullName ?? '')
  }

  return (
    <>
      <Head title="Mark Student Attendance" />

      <div className="max-w-2xl">
        <div className="mb-6">
          <Link href="/attendance/students" className="text-blue-600 hover:underline">
            &larr; Back to Student Attendance
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Mark Student Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormField label="Search Student" htmlFor="studentSearch" error={errors.studentId}>
                <Input
                  id="studentSearch"
                  placeholder="Search by name or student ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border border-gray-300"
                />
                {searchTerm && !data.studentId && filteredStudents.length > 0 && (
                  <div className="border rounded-md max-h-40 overflow-y-auto">
                    {filteredStudents.slice(0, 10).map((student) => (
                      <button
                        key={student.id}
                        type="button"
                        onClick={() => selectStudent(student)}
                        className="w-full text-left px-3 py-2 hover:bg-gray-100"
                      >
                        {student.fullName} ({student.studentId})
                      </button>
                    ))}
                  </div>
                )}
              </FormField>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="Date" htmlFor="date" error={errors.date}>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={data.date}
                    max={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setData('date', e.target.value)}
                    className="border border-gray-300"
                  />
                </FormField>

                <FormField label="Status" htmlFor="status" error={errors.status}>
                  <Select
                    value={data.status}
                    onValueChange={(value) =>
                      setData(
                        'status',
                        value as 'present' | 'absent' | 'late' | 'excused' | 'half_day'
                      )
                    }
                  >
                    <SelectTrigger id="status" className="w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="present">Present</SelectItem>
                      <SelectItem value="absent">Absent</SelectItem>
                      <SelectItem value="late">Late</SelectItem>
                      <SelectItem value="excused">Excused</SelectItem>
                      <SelectItem value="half_day">Half Day</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Academic Year"
                  htmlFor="academicYearId"
                  error={errors.academicYearId}
                >
                  <Select
                    value={data.academicYearId || 'none'}
                    onValueChange={(value) =>
                      setData('academicYearId', value === 'none' ? '' : value)
                    }
                  >
                    <SelectTrigger id="academicYearId" className="w-full">
                      <SelectValue placeholder="Select Academic Year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Select Academic Year</SelectItem>
                      {academicYears.map((year) => (
                        <SelectItem key={year.id} value={year.id}>
                          {year.name} {year.isCurrent ? '(Current)' : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>

                <FormField label="Class (Optional)" htmlFor="classId" error={errors.classId}>
                  <Select
                    value={data.classId || 'none'}
                    onValueChange={(value) => setData('classId', value === 'none' ? '' : value)}
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
              </div>

              <FormField label="Remarks (Optional)" htmlFor="remarks" error={errors.remarks}>
                <Input
                  id="remarks"
                  name="remarks"
                  placeholder="Add any remarks..."
                  value={data.remarks}
                  onChange={(e) => setData('remarks', e.target.value)}
                  className="border border-gray-300"
                />
              </FormField>

              <div className="flex gap-2">
                <Button type="submit" disabled={processing || !data.studentId}>
                  {processing ? 'Saving...' : 'Mark Attendance'}
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
      </div>
    </>
  )
}

MarkStudentAttendancePage.layout = (page: ReactElement) => <DashboardLayout>{page}</DashboardLayout>

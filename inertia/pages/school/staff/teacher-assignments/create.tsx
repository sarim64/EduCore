import { ReactElement } from 'react'
import { Head, Link, useForm } from '@inertiajs/react'
import DashboardLayout from '~/layouts/DashboardLayout'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { FormField } from '~/components/FormField'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '~/components/ui/select'
import type { StaffMember } from '~/types/staff'
import type { AcademicYear, SchoolClass, Section, Subject } from '~/types/academics'

export default function CreateTeacherAssignmentPage({
  staff,
  academicYears,
  classes,
  sections,
  subjects,
}: {
  staff: StaffMember[]
  academicYears: AcademicYear[]
  classes: SchoolClass[]
  sections: Section[]
  subjects: Subject[]
}) {
  const currentYear = academicYears.find((y) => y.isCurrent)
  const { data, setData, post, errors, processing } = useForm({
    staffMemberId: '',
    academicYearId: currentYear?.id || '',
    classId: '',
    sectionId: '',
    subjectId: '',
    isClassTeacher: false,
    notes: '',
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    post('/staff/teacher-assignments')
  }

  const filteredSections = data.classId
    ? sections.filter((s) => s.classId === data.classId)
    : sections

  return (
    <>
      <Head title="Add Teacher Assignment" />

      <div className="max-w-2xl">
        <div className="mb-6">
          <Link href="/staff/teacher-assignments" className="text-blue-600 hover:underline">
            &larr; Back to Teacher Assignments
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Add Teacher Assignment</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormField label="Teacher" required error={errors.staffMemberId}>
                <Select
                  value={data.staffMemberId}
                  onValueChange={(value) => setData('staffMemberId', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Teacher" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Select Teacher</SelectItem>
                    {staff.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.fullName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label="Academic Year" required error={errors.academicYearId}>
                <Select
                  value={data.academicYearId}
                  onValueChange={(value) => setData('academicYearId', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Academic Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Select Academic Year</SelectItem>
                    {academicYears.map((year) => (
                      <SelectItem key={year.id} value={year.id}>
                        {year.name} {year.isCurrent && '(Current)'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="Class" required error={errors.classId}>
                  <Select
                    value={data.classId}
                    onValueChange={(value) => {
                      setData('classId', value)
                      setData('sectionId', '')
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Select Class</SelectItem>
                      {classes.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>

                <FormField label="Section (Optional)" error={errors.sectionId}>
                  <Select
                    value={data.sectionId}
                    onValueChange={(value) => setData('sectionId', value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="All Sections" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Sections</SelectItem>
                      {filteredSections.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>
              </div>

              <FormField label="Subject" required error={errors.subjectId}>
                <Select
                  value={data.subjectId}
                  onValueChange={(value) => setData('subjectId', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Select Subject</SelectItem>
                    {subjects.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name} {s.code && `(${s.code})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              <div className="flex items-center gap-2">
                <FormField label="Is Class Teacher" error={errors.isClassTeacher}>
                  <Input
                    id="isClassTeacher"
                    type="checkbox"
                    checked={data.isClassTeacher}
                    onChange={(e) => setData('isClassTeacher', e.target.checked)}
                    className="h-4 w-4 border-gray-300 rounded"
                  />
                </FormField>
              </div>

              <FormField label="Notes" error={errors.notes}>
                <Input
                  id="notes"
                  value={data.notes}
                  onChange={(e) => setData('notes', e.target.value)}
                  placeholder="Optional notes about this assignment"
                  className="border border-gray-300"
                />
              </FormField>

              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={processing}>
                  {processing ? 'Creating...' : 'Create Assignment'}
                </Button>
                <Link href="/staff/teacher-assignments">
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

CreateTeacherAssignmentPage.layout = (page: ReactElement) => (
  <DashboardLayout>{page}</DashboardLayout>
)

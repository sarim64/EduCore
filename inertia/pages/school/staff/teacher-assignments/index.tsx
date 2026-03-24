import { ReactElement } from 'react'
import { Head, Link, useForm } from '@inertiajs/react'
import DashboardLayout from '~/layouts/DashboardLayout'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'

import type { TeacherAssignment } from '~/types/staff'

export default function TeacherAssignmentsIndexPage({
  assignments,
}: {
  assignments: TeacherAssignment[]
}) {
  const { delete: destroy, processing } = useForm()

  function handleDelete(id: string) {
    if (confirm('Are you sure you want to delete this assignment?')) {
      destroy(`/staff/teacher-assignments/${id}`)
    }
  }

  return (
    <>
      <Head title="Teacher Assignments" />

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Teacher Assignments</h1>
          <Link href="/staff/teacher-assignments/create">
            <Button>Add Assignment</Button>
          </Link>
        </div>

        <div className="grid gap-4">
          {assignments.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-gray-500">
                No teacher assignments found. Create one to get started.
              </CardContent>
            </Card>
          ) : (
            assignments.map((assignment) => (
              <Card key={assignment.id}>
                <CardHeader className="flex flex-row items-center justify-between py-4">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {assignment.staff?.fullName || 'Unknown Teacher'}
                      {assignment.isClassTeacher && (
                        <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800">
                          Class Teacher
                        </span>
                      )}
                    </CardTitle>
                    <div className="text-sm text-gray-600 mt-1 space-y-1">
                      <p>
                        <span className="font-medium">Subject:</span>{' '}
                        {assignment.subject?.name || 'N/A'}
                        {assignment.subject?.code && ` (${assignment.subject.code})`}
                      </p>
                      <p>
                        <span className="font-medium">Class:</span>{' '}
                        {assignment.class?.name || 'N/A'}
                        {assignment.section && ` - Section ${assignment.section.name}`}
                      </p>
                      <p>
                        <span className="font-medium">Academic Year:</span>{' '}
                        {assignment.academicYear?.name || 'N/A'}
                        {assignment.academicYear?.isCurrent && (
                          <span className="ml-2 text-xs px-2 py-0.5 rounded bg-green-100 text-green-800">
                            Current
                          </span>
                        )}
                      </p>
                      {assignment.notes && (
                        <p className="text-gray-500 italic">{assignment.notes}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/staff/teacher-assignments/${assignment.id}/edit`}>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(assignment.id)}
                      disabled={processing}
                    >
                      Delete
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            ))
          )}
        </div>
      </div>
    </>
  )
}

TeacherAssignmentsIndexPage.layout = (page: ReactElement) => (
  <DashboardLayout>{page}</DashboardLayout>
)

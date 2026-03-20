import { ReactElement } from 'react'
import { Head, Link, useForm } from '@inertiajs/react'
import DashboardLayout from '~/layouts/DashboardLayout'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'

import type { StaffMember, StaffQualification } from '~/types/staff'

export default function QualificationsIndexPage({
  staff,
  qualifications,
}: {
  staff: StaffMember
  qualifications: StaffQualification[]
}) {
  const { delete: destroy, processing } = useForm()

  function handleDelete(qualificationId: string) {
    if (confirm('Are you sure you want to delete this qualification?')) {
      destroy(`/staff/members/${staff.id}/qualifications/${qualificationId}`)
    }
  }

  return (
    <>
      <Head title={`Qualifications - ${staff.fullName}`} />

      <div className="space-y-6">
        <div className="mb-6">
          <Link href={`/staff/members/${staff.id}`} className="text-blue-600 hover:underline">
            &larr; Back to {staff.fullName}
          </Link>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Qualifications</h1>
            <p className="text-gray-600">
              {staff.fullName} ({staff.staffMemberId})
            </p>
          </div>
          <Link href={`/staff/members/${staff.id}/qualifications/create`}>
            <Button>Add Qualification</Button>
          </Link>
        </div>

        <div className="grid gap-4">
          {qualifications.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-gray-500">
                No qualifications recorded. Add one to get started.
              </CardContent>
            </Card>
          ) : (
            qualifications.map((qualification) => (
              <Card key={qualification.id}>
                <CardHeader className="flex flex-row items-center justify-between py-4">
                  <div>
                    <CardTitle className="text-lg">{qualification.degree}</CardTitle>
                    <div className="text-sm text-gray-600 mt-1 space-y-1">
                      {qualification.fieldOfStudy && (
                        <p>Field of Study: {qualification.fieldOfStudy}</p>
                      )}
                      <p>Institution: {qualification.institution}</p>
                      <p>Year: {qualification.year}</p>
                      {qualification.grade && <p>Grade: {qualification.grade}</p>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/staff/members/${staff.id}/qualifications/${qualification.id}/edit`}
                    >
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(qualification.id)}
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

QualificationsIndexPage.layout = (page: ReactElement) => <DashboardLayout>{page}</DashboardLayout>

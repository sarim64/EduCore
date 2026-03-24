import { ReactElement } from 'react'
import { Head, Link, useForm } from '@inertiajs/react'
import DashboardLayout from '~/layouts/DashboardLayout'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { FormField } from '~/components/FormField'

import type { StaffMember } from '~/types/staff'

export default function CreateQualificationPage({ staff }: { staff: StaffMember }) {
  const { data, setData, post, errors, processing } = useForm({
    degree: '',
    fieldOfStudy: '',
    institution: '',
    year: new Date().getFullYear(),
    grade: '',
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    post(`/staff/members/${staff.id}/qualifications`)
  }

  return (
    <>
      <Head title={`Add Qualification - ${staff.fullName}`} />

      <div className="max-w-2xl">
        <div className="mb-6">
          <Link
            href={`/staff/members/${staff.id}/qualifications`}
            className="text-blue-600 hover:underline"
          >
            &larr; Back to Qualifications
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Add Qualification</CardTitle>
            <p className="text-sm text-gray-600">
              {staff.fullName} ({staff.staffMemberId})
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormField label="Degree" required error={errors.degree}>
                <Input
                  id="degree"
                  value={data.degree}
                  onChange={(e) => setData('degree', e.target.value)}
                  placeholder="e.g., M.Sc, B.Ed, Ph.D"
                  className="border border-gray-300"
                />
              </FormField>

              <FormField label="Field of Study" error={errors.fieldOfStudy}>
                <Input
                  id="fieldOfStudy"
                  value={data.fieldOfStudy}
                  onChange={(e) => setData('fieldOfStudy', e.target.value)}
                  placeholder="e.g., Mathematics, Computer Science"
                  className="border border-gray-300"
                />
              </FormField>

              <FormField label="Institution" required error={errors.institution}>
                <Input
                  id="institution"
                  value={data.institution}
                  onChange={(e) => setData('institution', e.target.value)}
                  placeholder="e.g., Punjab University"
                  className="border border-gray-300"
                />
              </FormField>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="Year" required error={errors.year}>
                  <Input
                    id="year"
                    type="number"
                    min="1950"
                    max={new Date().getFullYear()}
                    value={data.year}
                    onChange={(e) => setData('year', parseInt(e.target.value) || 0)}
                    className="border border-gray-300"
                  />
                </FormField>

                <FormField label="Grade" error={errors.grade}>
                  <Input
                    id="grade"
                    value={data.grade}
                    onChange={(e) => setData('grade', e.target.value)}
                    placeholder="e.g., A, A-, B+"
                    className="border border-gray-300"
                  />
                </FormField>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={processing}>
                  {processing ? 'Adding...' : 'Add Qualification'}
                </Button>
                <Link href={`/staff/members/${staff.id}/qualifications`}>
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

CreateQualificationPage.layout = (page: ReactElement) => <DashboardLayout>{page}</DashboardLayout>

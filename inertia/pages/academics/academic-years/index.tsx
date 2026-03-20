import { ReactElement } from 'react'
import { Head, Link, useForm } from '@inertiajs/react'
import DashboardLayout from '~/layouts/DashboardLayout'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'

import type { AcademicYear } from '~/types/academics'

export default function AcademicYearsIndexPage({
  academicYears,
}: {
  academicYears: AcademicYear[]
}) {
  const { delete: destroy, processing } = useForm()

  function handleDelete(id: string) {
    if (confirm('Are you sure you want to delete this academic year?')) {
      destroy(`/academics/years/${id}`)
    }
  }

  return (
    <>
      <Head title="Academic Years" />

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Academic Years</h1>
          <Link href="/academics/years/create">
            <Button>Add Academic Year</Button>
          </Link>
        </div>

        <div className="grid gap-4">
          {academicYears.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-gray-500">
                No academic years found. Create one to get started.
              </CardContent>
            </Card>
          ) : (
            academicYears.map((year) => (
              <Card key={year.id}>
                <CardHeader className="flex flex-row items-center justify-between py-4">
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-lg">{year.name}</CardTitle>
                    {year.isCurrent && (
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                        Current
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/academics/years/${year.id}/edit`}>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(year.id)}
                      disabled={processing}
                    >
                      Delete
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="py-2">
                  <p className="text-sm text-gray-600">
                    {year.startDate} to {year.endDate}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </>
  )
}

AcademicYearsIndexPage.layout = (page: ReactElement) => <DashboardLayout>{page}</DashboardLayout>

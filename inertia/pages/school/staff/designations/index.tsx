import { ReactElement } from 'react'
import { Head, Link, useForm } from '@inertiajs/react'
import DashboardLayout from '~/layouts/DashboardLayout'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'

import type { Designation } from '~/types/staff'

export default function DesignationsIndexPage({ designations }: { designations: Designation[] }) {
  const { delete: destroy, processing } = useForm()

  function handleDelete(id: string) {
    if (confirm('Are you sure you want to delete this designation?')) {
      destroy(`/staff/designations/${id}`)
    }
  }

  return (
    <>
      <Head title="Designations" />

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Designations</h1>
          <Link href="/staff/designations/create">
            <Button>Add Designation</Button>
          </Link>
        </div>

        <div className="grid gap-4">
          {designations.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-gray-500">
                No designations found. Create one to get started.
              </CardContent>
            </Card>
          ) : (
            designations.map((designation) => (
              <Card key={designation.id}>
                <CardHeader className="flex flex-row items-center justify-between py-4">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {designation.name}
                      <span
                        className={`text-xs px-2 py-1 rounded ${designation.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}
                      >
                        {designation.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </CardTitle>
                    {designation.department && (
                      <p className="text-sm text-gray-600 mt-1">
                        Department: {designation.department.name}
                      </p>
                    )}
                    {designation.description && (
                      <p className="text-sm text-gray-500 mt-1">{designation.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/staff/designations/${designation.id}/edit`}>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(designation.id)}
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

DesignationsIndexPage.layout = (page: ReactElement) => <DashboardLayout>{page}</DashboardLayout>

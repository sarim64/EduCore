import { ReactElement } from 'react'
import { Head, Link, useForm } from '@inertiajs/react'
import DashboardLayout from '~/layouts/DashboardLayout'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'

import type { Department } from '~/types/staff'

export default function DepartmentsIndexPage({ departments }: { departments: Department[] }) {
  const { delete: destroy, processing } = useForm()

  function handleDelete(id: string) {
    if (confirm('Are you sure you want to delete this department?')) {
      destroy(`/staff/departments/${id}`)
    }
  }

  return (
    <>
      <Head title="Departments" />

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Departments</h1>
          <Link href="/staff/departments/create">
            <Button>Add Department</Button>
          </Link>
        </div>

        <div className="grid gap-4">
          {departments.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-gray-500">
                No departments found. Create one to get started.
              </CardContent>
            </Card>
          ) : (
            departments.map((dept) => (
              <Card key={dept.id}>
                <CardHeader className="flex flex-row items-center justify-between py-4">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {dept.name}
                      <span
                        className={`text-xs px-2 py-1 rounded ${dept.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}
                      >
                        {dept.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </CardTitle>
                    {dept.description && (
                      <p className="text-sm text-gray-600 mt-1">{dept.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/staff/departments/${dept.id}/edit`}>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(dept.id)}
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

DepartmentsIndexPage.layout = (page: ReactElement) => <DashboardLayout>{page}</DashboardLayout>

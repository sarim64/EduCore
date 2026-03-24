import { ReactElement } from 'react'
import { Head, Link, useForm } from '@inertiajs/react'
import DashboardLayout from '~/layouts/DashboardLayout'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import type { SchoolClass } from '~/types'

export default function ClassesIndexPage({ classes }: { classes: SchoolClass[] }) {
  const { delete: destroy, processing } = useForm()

  function handleDelete(id: string) {
    if (confirm('Are you sure you want to delete this class?')) {
      destroy(`/academics/classes/${id}`)
    }
  }

  return (
    <>
      <Head title="Classes" />

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Classes</h1>
          <Link href="/academics/classes/create">
            <Button>Add Class</Button>
          </Link>
        </div>

        <div className="grid gap-4">
          {classes.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-gray-500">
                No classes found. Create one to get started.
              </CardContent>
            </Card>
          ) : (
            classes.map((cls) => (
              <Card key={cls.id}>
                <CardHeader className="flex flex-row items-center justify-between py-4">
                  <div>
                    <CardTitle className="text-lg">
                      {cls.name}
                      {cls.code && (
                        <span className="ml-2 text-sm font-normal text-gray-500">({cls.code})</span>
                      )}
                    </CardTitle>
                    {cls.description && (
                      <p className="text-sm text-gray-600 mt-1">{cls.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/academics/classes/${cls.id}`}>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </Link>
                    <Link href={`/academics/classes/${cls.id}/edit`}>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(cls.id)}
                      disabled={processing}
                    >
                      Delete
                    </Button>
                  </div>
                </CardHeader>
                {cls.sections && cls.sections.length > 0 && (
                  <CardContent className="py-2 border-t">
                    <p className="text-sm text-gray-600">
                      Sections: {cls.sections.map((s) => s.name).join(', ')}
                    </p>
                  </CardContent>
                )}
              </Card>
            ))
          )}
        </div>
      </div>
    </>
  )
}

ClassesIndexPage.layout = (page: ReactElement) => <DashboardLayout>{page}</DashboardLayout>

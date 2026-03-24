import { ReactElement } from 'react'
import { Head, Link, useForm } from '@inertiajs/react'
import DashboardLayout from '~/layouts/DashboardLayout'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import type { Subject } from '~/types'

export default function SubjectsIndexPage({ subjects }: { subjects: Subject[] }) {
  const { delete: destroy, processing } = useForm()

  function handleDelete(id: string) {
    if (confirm('Are you sure you want to delete this subject?')) {
      destroy(`/academics/subjects/${id}`)
    }
  }

  return (
    <>
      <Head title="Subjects" />

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Subjects</h1>
          <Link href="/academics/subjects/create">
            <Button>Add Subject</Button>
          </Link>
        </div>

        <div className="grid gap-4">
          {subjects.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-gray-500">
                No subjects found. Create one to get started.
              </CardContent>
            </Card>
          ) : (
            subjects.map((subject) => (
              <Card key={subject.id}>
                <CardHeader className="flex flex-row items-center justify-between py-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{subject.name}</CardTitle>
                      {subject.code && (
                        <span className="text-sm text-gray-500">({subject.code})</span>
                      )}
                      {subject.isElective && (
                        <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
                          Elective
                        </span>
                      )}
                    </div>
                    {subject.description && (
                      <p className="text-sm text-gray-600 mt-1">{subject.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/academics/subjects/${subject.id}`}>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </Link>
                    <Link href={`/academics/subjects/${subject.id}/edit`}>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(subject.id)}
                      disabled={processing}
                    >
                      Delete
                    </Button>
                  </div>
                </CardHeader>
                {subject.classes && subject.classes.length > 0 && (
                  <CardContent className="py-2 border-t">
                    <p className="text-sm text-gray-600">
                      Classes: {subject.classes.map((c) => c.name).join(', ')}
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

SubjectsIndexPage.layout = (page: ReactElement) => <DashboardLayout>{page}</DashboardLayout>

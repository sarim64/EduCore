import { ReactElement, useState } from 'react'
import { Head, Link, useForm } from '@inertiajs/react'
import DashboardLayout from '~/layouts/DashboardLayout'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { FormField } from '~/components/FormField'
import { Input } from '~/components/ui/input'
import type { SchoolClass } from '~/types'

export default function ShowClassPage({ schoolClass }: { schoolClass: SchoolClass }) {
  const [showAddSection, setShowAddSection] = useState(false)

  const sectionForm = useForm({
    classId: schoolClass.id,
    name: '',
    capacity: '',
  })

  const deleteForm = useForm()

  function handleAddSection(e: React.FormEvent) {
    e.preventDefault()
    sectionForm.post('/academics/sections', {
      onSuccess: () => {
        sectionForm.reset('name', 'capacity')
        setShowAddSection(false)
      },
    })
  }

  function handleDeleteSection(sectionId: string) {
    if (confirm('Are you sure you want to delete this section?')) {
      deleteForm.delete(`/academics/sections/${sectionId}`)
    }
  }

  return (
    <>
      <Head title={`Class: ${schoolClass.name}`} />

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Link href="/academics/classes" className="text-blue-600 hover:underline text-sm">
              &larr; Back to Classes
            </Link>
            <h1 className="text-2xl font-bold mt-2">
              {schoolClass.name}
              {schoolClass.code && (
                <span className="ml-2 text-lg font-normal text-gray-500">({schoolClass.code})</span>
              )}
            </h1>
            {schoolClass.description && (
              <p className="text-gray-600 mt-1">{schoolClass.description}</p>
            )}
          </div>
          <Link href={`/academics/classes/${schoolClass.id}/edit`}>
            <Button variant="outline">Edit Class</Button>
          </Link>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Sections</CardTitle>
            <Button size="sm" onClick={() => setShowAddSection(!showAddSection)}>
              {showAddSection ? 'Cancel' : 'Add Section'}
            </Button>
          </CardHeader>
          <CardContent>
            {showAddSection && (
              <form onSubmit={handleAddSection} className="mb-4 p-4 border rounded-lg bg-gray-50">
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Section Name" htmlFor="sectionName" error={sectionForm.errors.name}>
                    <Input
                      id="sectionName"
                      name="name"
                      placeholder="A"
                      value={sectionForm.data.name}
                      onChange={(e) => sectionForm.setData('name', e.target.value)}
                      className="border border-gray-300"
                    />
                  </FormField>
                  <FormField label="Capacity (Optional)" htmlFor="capacity" error={sectionForm.errors.capacity}>
                    <Input
                      id="capacity"
                      name="capacity"
                      type="number"
                      placeholder="30"
                      value={sectionForm.data.capacity}
                      onChange={(e) => sectionForm.setData('capacity', e.target.value)}
                      className="border border-gray-300"
                    />
                  </FormField>
                </div>
                <Button type="submit" className="mt-4" disabled={sectionForm.processing}>
                  {sectionForm.processing ? 'Adding...' : 'Add Section'}
                </Button>
              </form>
            )}

            {!schoolClass.sections || schoolClass.sections.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No sections added yet. Add a section to get started.
              </p>
            ) : (
              <div className="divide-y">
                {schoolClass.sections.map((section) => (
                  <div key={section.id} className="py-3 flex justify-between items-center">
                    <div>
                      <span className="font-medium">{section.name}</span>
                      {section.capacity && (
                        <span className="ml-2 text-sm text-gray-500">
                          (Capacity: {section.capacity})
                        </span>
                      )}
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteSection(section.id)}
                      disabled={deleteForm.processing}
                    >
                      Delete
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}

ShowClassPage.layout = (page: ReactElement) => <DashboardLayout>{page}</DashboardLayout>

import { ReactElement, useState } from 'react'
import { Head, Link, useForm } from '@inertiajs/react'
import DashboardLayout from '~/layouts/DashboardLayout'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { FormField } from '~/components/FormField'
import { Input } from '~/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { Switch } from '~/components/ui/switch'
import type { SchoolClass, Subject } from '~/types'

export default function ShowSubjectPage({
  subject,
  allClasses,
}: {
  subject: Subject
  allClasses: SchoolClass[]
}) {
  const [showAssignForm, setShowAssignForm] = useState(false)

  const assignForm = useForm({
    classId: '',
    subjectId: subject.id,
    periodsPerWeek: 1,
    isMandatory: true,
  })

  const removeForm = useForm()

  const assignedClassIds = subject.classes?.map((c) => c.id) || []
  const availableClasses = allClasses.filter((c) => !assignedClassIds.includes(c.id))

  function handleAssign(e: React.FormEvent) {
    e.preventDefault()
    assignForm.post('/academics/subjects/assign', {
      onSuccess: () => {
        assignForm.reset()
        setShowAssignForm(false)
      },
    })
  }

  function handleRemove(classId: string) {
    if (confirm('Are you sure you want to remove this subject from the class?')) {
      removeForm.delete(`/academics/subjects/${subject.id}/class/${classId}`)
    }
  }

  return (
    <>
      <Head title={`Subject: ${subject.name}`} />

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Link href="/academics/subjects" className="text-blue-600 hover:underline text-sm">
              &larr; Back to Subjects
            </Link>
            <h1 className="text-2xl font-bold mt-2">
              {subject.name}
              {subject.code && (
                <span className="ml-2 text-lg font-normal text-gray-500">({subject.code})</span>
              )}
              {subject.isElective && (
                <Badge className="ml-2 px-2 py-0.5 text-sm bg-blue-100 text-blue-800 rounded-full">
                  Elective
                </Badge>
              )}
            </h1>
            {subject.description && <p className="text-gray-600 mt-1">{subject.description}</p>}
          </div>
          <Link href={`/academics/subjects/${subject.id}/edit`}>
            <Button variant="outline">Edit Subject</Button>
          </Link>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Assigned Classes</CardTitle>
            {availableClasses.length > 0 && (
              <Button size="sm" onClick={() => setShowAssignForm(!showAssignForm)}>
                {showAssignForm ? 'Cancel' : 'Assign to Class'}
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {showAssignForm && (
              <form onSubmit={handleAssign} className="mb-4 p-4 border rounded-lg bg-gray-50">
                <div className="grid grid-cols-3 gap-4">
                  <FormField label="Class" htmlFor="classId" error={assignForm.errors.classId}>
                    <Select
                      value={assignForm.data.classId || 'none'}
                      onValueChange={(value) =>
                        assignForm.setData('classId', value === 'none' ? '' : value)
                      }
                    >
                      <SelectTrigger id="classId" className="w-full">
                        <SelectValue placeholder="Select a class" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Select a class</SelectItem>
                        {availableClasses.map((cls) => (
                          <SelectItem key={cls.id} value={cls.id}>
                            {cls.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormField>

                  <FormField
                    label="Periods Per Week"
                    htmlFor="periodsPerWeek"
                    error={assignForm.errors.periodsPerWeek}
                  >
                    <Input
                      id="periodsPerWeek"
                      name="periodsPerWeek"
                      type="number"
                      min="1"
                      value={assignForm.data.periodsPerWeek}
                      onChange={(e) =>
                        assignForm.setData('periodsPerWeek', parseInt(e.target.value) || 1)
                      }
                      className="border border-gray-300"
                    />
                  </FormField>

                  <FormField label="Mandatory" htmlFor="isMandatory" error={assignForm.errors.isMandatory}>
                    <div className="flex items-center h-9">
                      <Switch
                        id="isMandatory"
                        checked={assignForm.data.isMandatory}
                        onCheckedChange={(checked) => assignForm.setData('isMandatory', checked)}
                      />
                    </div>
                  </FormField>
                </div>
                <Button type="submit" className="mt-4" disabled={assignForm.processing}>
                  {assignForm.processing ? 'Assigning...' : 'Assign to Class'}
                </Button>
              </form>
            )}

            {!subject.classes || subject.classes.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                This subject is not assigned to any classes yet.
              </p>
            ) : (
              <div className="divide-y">
                {subject.classes.map((cls) => (
                  <div key={cls.id} className="py-3 flex justify-between items-center">
                    <div>
                      <span className="font-medium">{cls.name}</span>
                      <span className="ml-2 text-sm text-gray-500">
                        ({cls.meta?.pivot_periods_per_week || 1} periods/week
                        {cls.meta?.pivot_is_mandatory === false && ', Optional'})
                      </span>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemove(cls.id)}
                      disabled={removeForm.processing}
                    >
                      Remove
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

ShowSubjectPage.layout = (page: ReactElement) => <DashboardLayout>{page}</DashboardLayout>

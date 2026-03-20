import { ReactElement } from 'react'
import { Head, Link, useForm } from '@inertiajs/react'
import DashboardLayout from '~/layouts/DashboardLayout'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { FormField } from '~/components/FormField'
import { Input } from '~/components/ui/input'
import { Switch } from '~/components/ui/switch'
import type { Subject } from '~/types'

export default function EditSubjectPage({ subject }: { subject: Subject }) {
  const { data, setData, put, errors, processing } = useForm({
    name: subject.name,
    code: subject.code || '',
    description: subject.description || '',
    isElective: subject.isElective,
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    put(`/academics/subjects/${subject.id}`)
  }

  return (
    <>
      <Head title="Edit Subject" />

      <div className="max-w-2xl">
        <div className="mb-6">
          <Link href="/academics/subjects" className="text-blue-600 hover:underline">
            &larr; Back to Subjects
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Edit Subject</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormField label="Subject Name" htmlFor="name" error={errors.name}>
                <Input
                  id="name"
                  name="name"
                  placeholder="Mathematics"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  className="border border-gray-300"
                />
              </FormField>

              <FormField label="Code (Optional)" htmlFor="code" error={errors.code}>
                <Input
                  id="code"
                  name="code"
                  placeholder="MATH"
                  value={data.code}
                  onChange={(e) => setData('code', e.target.value)}
                  className="border border-gray-300"
                />
              </FormField>

              <FormField label="Description (Optional)" htmlFor="description" error={errors.description}>
                <Input
                  id="description"
                  name="description"
                  placeholder="Description of the subject"
                  value={data.description}
                  onChange={(e) => setData('description', e.target.value)}
                  className="border border-gray-300"
                />
              </FormField>

              <FormField label="This is an elective subject" htmlFor="isElective" error={errors.isElective}>
                <Switch
                  id="isElective"
                  checked={data.isElective}
                  onCheckedChange={(checked) => setData('isElective', checked)}
                />
              </FormField>

              <div className="flex gap-2">
                <Button type="submit" disabled={processing}>
                  {processing ? 'Saving...' : 'Save Changes'}
                </Button>
                <Link href="/academics/subjects">
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

EditSubjectPage.layout = (page: ReactElement) => <DashboardLayout>{page}</DashboardLayout>

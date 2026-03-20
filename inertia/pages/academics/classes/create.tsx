import { ReactElement } from 'react'
import { Head, Link, useForm } from '@inertiajs/react'
import DashboardLayout from '~/layouts/DashboardLayout'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { FormField } from '~/components/FormField'
import { Input } from '~/components/ui/input'

export default function CreateClassPage() {
  const { data, setData, post, errors, processing } = useForm({
    name: '',
    code: '',
    displayOrder: 0,
    description: '',
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    post('/academics/classes')
  }

  return (
    <>
      <Head title="Create Class" />

      <div className="max-w-2xl">
        <div className="mb-6">
          <Link href="/academics/classes" className="text-blue-600 hover:underline">
            &larr; Back to Classes
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create Class</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormField label="Class Name" htmlFor="name" error={errors.name}>
                <Input
                  id="name"
                  name="name"
                  placeholder="Grade 1"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  className="border border-gray-300"
                />
              </FormField>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="Code (Optional)" htmlFor="code" error={errors.code}>
                  <Input
                    id="code"
                    name="code"
                    placeholder="G1"
                    value={data.code}
                    onChange={(e) => setData('code', e.target.value)}
                    className="border border-gray-300"
                  />
                </FormField>

                <FormField label="Display Order" htmlFor="displayOrder" error={errors.displayOrder}>
                  <Input
                    id="displayOrder"
                    name="displayOrder"
                    type="number"
                    value={data.displayOrder}
                    onChange={(e) => setData('displayOrder', parseInt(e.target.value) || 0)}
                    className="border border-gray-300"
                  />
                </FormField>
              </div>

              <FormField label="Description (Optional)" htmlFor="description" error={errors.description}>
                <Input
                  id="description"
                  name="description"
                  placeholder="Description of the class"
                  value={data.description}
                  onChange={(e) => setData('description', e.target.value)}
                  className="border border-gray-300"
                />
              </FormField>

              <div className="flex gap-2">
                <Button type="submit" disabled={processing}>
                  {processing ? 'Creating...' : 'Create Class'}
                </Button>
                <Link href="/academics/classes">
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

CreateClassPage.layout = (page: ReactElement) => <DashboardLayout>{page}</DashboardLayout>

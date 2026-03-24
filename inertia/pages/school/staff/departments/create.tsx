import { ReactElement } from 'react'
import { Head, Link, useForm } from '@inertiajs/react'
import DashboardLayout from '~/layouts/DashboardLayout'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { FormField } from '~/components/FormField'
export default function CreateDepartmentPage() {
  const { data, setData, post, errors, processing } = useForm({
    name: '',
    description: '',
    isActive: true,
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    post('/staff/departments')
  }

  return (
    <>
      <Head title="Create Department" />

      <div className="max-w-2xl">
        <div className="mb-6">
          <Link href="/staff/departments" className="text-blue-600 hover:underline">
            &larr; Back to Departments
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create Department</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormField label="Department Name" error={errors.name}>
                <Input
                  id="name"
                  name="name"
                  placeholder="e.g., Mathematics"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  className="border border-gray-300"
                />
              </FormField>

              <FormField label="Description (Optional)" error={errors.description}>
                <Input
                  id="description"
                  name="description"
                  placeholder="Brief description of the department"
                  value={data.description}
                  onChange={(e) => setData('description', e.target.value)}
                  className="border border-gray-300"
                />
              </FormField>

              <FormField label="Active" error={errors.isActive}>
                <input
                  type="checkbox"
                  id="isActive"
                  checked={data.isActive}
                  onChange={(e) => setData('isActive', e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                />
              </FormField>

              <div className="flex gap-2">
                <Button type="submit" disabled={processing}>
                  {processing ? 'Creating...' : 'Create Department'}
                </Button>
                <Link href="/staff/departments">
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

CreateDepartmentPage.layout = (page: ReactElement) => <DashboardLayout>{page}</DashboardLayout>

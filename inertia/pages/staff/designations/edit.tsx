import { ReactElement } from 'react'
import { Head, Link, useForm } from '@inertiajs/react'
import DashboardLayout from '~/layouts/DashboardLayout'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { FormField } from '~/components/FormField'
import type { Designation, Department } from '~/types/staff'

export default function EditDesignationPage({
  designation,
  departments,
}: {
  designation: Designation
  departments: Department[]
}) {
  const { data, setData, put, errors, processing } = useForm({
    departmentId: designation.departmentId,
    name: designation.name,
    description: designation.description || '',
    isActive: designation.isActive,
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    put(`/staff/designations/${designation.id}`)
  }

  return (
    <>
      <Head title="Edit Designation" />

      <div className="max-w-2xl">
        <div className="mb-6">
          <Link href="/staff/designations" className="text-blue-600 hover:underline">
            &larr; Back to Designations
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Edit Designation</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormField label="Department" error={errors.departmentId}>
                <Select
                  value={data.departmentId || (departments.length === 0 ? 'none' : undefined)}
                  onValueChange={(value) => setData('departmentId', value === 'none' ? '' : value)}
                >
                  <SelectTrigger id="departmentId" className="w-full">
                    <SelectValue placeholder="Select a department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.length === 0 ? (
                      <SelectItem value="none">Not available</SelectItem>
                    ) : (
                      departments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.id}>
                          {dept.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label="Designation Name" error={errors.name}>
                <Input
                  id="name"
                  name="name"
                  placeholder="e.g., Senior Teacher"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  className="border border-gray-300"
                />
              </FormField>

              <FormField label="Description (Optional)" error={errors.description}>
                <Input
                  id="description"
                  name="description"
                  placeholder="Brief description of the designation"
                  value={data.description}
                  onChange={(e) => setData('description', e.target.value)}
                  className="border border-gray-300"
                />
              </FormField>

              <FormField label="Active" error={errors.isActive}>
                <Input
                  type="checkbox"
                  id="isActive"
                  checked={data.isActive}
                  onChange={(e) => setData('isActive', e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                />
              </FormField>

              <div className="flex gap-2">
                <Button type="submit" disabled={processing}>
                  {processing ? 'Saving...' : 'Save Changes'}
                </Button>
                <Link href="/staff/designations">
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

EditDesignationPage.layout = (page: ReactElement) => <DashboardLayout>{page}</DashboardLayout>

import { ReactElement } from 'react'
import { Head, Link, useForm } from '@inertiajs/react'
import DashboardLayout from '~/layouts/DashboardLayout'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { FormField } from '~/components/FormField'
import { Input } from '~/components/ui/input'
import { Switch } from '~/components/ui/switch'

export default function CreateAcademicYearPage() {
  const { data, setData, post, errors, processing } = useForm({
    name: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    post('/academics/years')
  }

  return (
    <>
      <Head title="Create Academic Year" />

      <div className="max-w-2xl">
        <div className="mb-6">
          <Link href="/academics/years" className="text-blue-600 hover:underline">
            &larr; Back to Academic Years
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create Academic Year</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormField label="Name" htmlFor="name" error={errors.name}>
                <Input
                  id="name"
                  name="name"
                  placeholder="2024-2025"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  className="border border-gray-300"
                />
              </FormField>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="Start Date" htmlFor="startDate" error={errors.startDate}>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={data.startDate}
                    onChange={(e) => setData('startDate', e.target.value)}
                    className="border border-gray-300"
                  />
                </FormField>

                <FormField label="End Date" htmlFor="endDate" error={errors.endDate}>
                  <Input
                    id="endDate"
                    name="endDate"
                    type="date"
                    value={data.endDate}
                    onChange={(e) => setData('endDate', e.target.value)}
                    className="border border-gray-300"
                  />
                </FormField>
              </div>

              <FormField label="Set as current academic year" htmlFor="isCurrent" error={errors.isCurrent}>
                <Switch
                  id="isCurrent"
                  checked={data.isCurrent}
                  onCheckedChange={(checked) => setData('isCurrent', checked)}
                />
              </FormField>

              <div className="flex gap-2">
                <Button type="submit" disabled={processing}>
                  {processing ? 'Creating...' : 'Create Academic Year'}
                </Button>
                <Link href="/academics/years">
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

CreateAcademicYearPage.layout = (page: ReactElement) => <DashboardLayout>{page}</DashboardLayout>

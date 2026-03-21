import { type ReactElement } from 'react'
import { Head, Link, useForm } from '@inertiajs/react'
import AdminLayout from '~/layouts/AdminLayout'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { FormField } from '~/components/FormField'
import { Input } from '~/components/ui/input'
import { Textarea } from '~/components/ui/textarea'

export default function AdminPlansCreatePage() {
  const { data, setData, post, errors, processing } = useForm({
    name: '',
    code: '',
    description: '',
    priceMonthly: 0,
    priceYearly: 0,
    maxStudents: -1,
    maxStaff: -1,
    isActive: true,
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    post('/admin/plans')
  }

  return (
    <>
      <Head title="Create Subscription Plan" />

      <div className="max-w-3xl mx-auto py-10 px-4 space-y-8">
        <div>
          <Link
            href="/admin/plans"
            className="text-[color:var(--primary)] hover:text-[color:var(--primary-foreground)] text-sm"
          >
            &larr; Back to Plans
          </Link>
          <h1 className="text-4xl font-bold text-[color:var(--foreground)] mt-2">
            Create Subscription Plan
          </h1>
          <p className="text-[color:var(--muted-foreground)] mt-1">
            Define a new pricing tier with feature limits
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="bg-[color:var(--card)] border-[color:var(--border)] shadow-md">
            <CardHeader>
              <CardTitle className="text-[color:var(--card-foreground)]">
                Plan Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Plan Name" required htmlFor="name" error={errors.name}>
                  <Input
                    id="name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    placeholder="e.g., Standard"
                  />
                </FormField>

                <FormField label="Plan Code" required htmlFor="code" error={errors.code}>
                  <Input
                    id="code"
                    value={data.code}
                    onChange={(e) => setData('code', e.target.value)}
                    placeholder="e.g., standard"
                  />
                </FormField>
              </div>

              <FormField label="Description" htmlFor="description" error={errors.description}>
                <Textarea
                  id="description"
                  value={data.description}
                  onChange={(e) => setData('description', e.target.value)}
                  placeholder="Brief description of this plan"
                />
              </FormField>
            </CardContent>
          </Card>

          <Card className="bg-[color:var(--card)] border-[color:var(--border)] shadow-md">
            <CardHeader>
              <CardTitle className="text-[color:var(--card-foreground)]">Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Monthly Price ($)" htmlFor="priceMonthly" error={errors.priceMonthly}>
                  <Input
                    id="priceMonthly"
                    type="number"
                    step="0.01"
                    min="0"
                    value={data.priceMonthly}
                    onChange={(e) => setData('priceMonthly', parseFloat(e.target.value) || 0)}
                  />
                </FormField>

                <FormField label="Yearly Price ($)" htmlFor="priceYearly" error={errors.priceYearly}>
                  <Input
                    id="priceYearly"
                    type="number"
                    step="0.01"
                    min="0"
                    value={data.priceYearly}
                    onChange={(e) => setData('priceYearly', parseFloat(e.target.value) || 0)}
                  />
                </FormField>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[color:var(--card)] border-[color:var(--border)] shadow-md">
            <CardHeader>
              <CardTitle className="text-[color:var(--card-foreground)]">Limits</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-[color:var(--muted-foreground)] text-sm">
                Set to -1 for unlimited.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Max Students" htmlFor="maxStudents" error={errors.maxStudents}>
                  <Input
                    id="maxStudents"
                    type="number"
                    value={data.maxStudents}
                    onChange={(e) => setData('maxStudents', parseInt(e.target.value) || 0)}
                  />
                </FormField>

                <FormField label="Max Staff" htmlFor="maxStaff" error={errors.maxStaff}>
                  <Input
                    id="maxStaff"
                    type="number"
                    value={data.maxStaff}
                    onChange={(e) => setData('maxStaff', parseInt(e.target.value) || 0)}
                  />
                </FormField>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button type="submit" disabled={processing}>
              {processing ? 'Creating...' : 'Create Plan'}
            </Button>
            <Link href="/admin/plans">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </>
  )
}

AdminPlansCreatePage.layout = (page: ReactElement) => <AdminLayout>{page}</AdminLayout>

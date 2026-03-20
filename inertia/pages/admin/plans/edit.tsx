import { type ReactElement } from 'react'
import { Head, Link, useForm } from '@inertiajs/react'
import AdminLayout from '~/layouts/AdminLayout'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { FormField } from '~/components/FormField'
import { Input } from '~/components/ui/input'
import { Switch } from '~/components/ui/switch'
import { Textarea } from '~/components/ui/textarea'
import type { SubscriptionPlan } from '~/types'

export default function AdminPlansEditPage({
  plan,
}: {
  plan: SubscriptionPlan
}) {
  const { data, setData, put, errors, processing } = useForm({
    name: plan.name,
    code: plan.code,
    description: plan.description || '',
    priceMonthly: plan.priceMonthly,
    priceYearly: plan.priceYearly,
    maxStudents: plan.maxStudents,
    maxStaff: plan.maxStaff,
    isActive: plan.isActive,
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    put(`/admin/plans/${plan.id}`)
  }

  return (
    <>
      <Head title={`Edit Plan: ${plan.name}`} />

      <div className="max-w-3xl mx-auto py-10 px-4 space-y-8">
        <div>
          <Link
            href="/admin/plans"
            className="text-[color:var(--primary)] hover:text-[color:var(--primary-foreground)] text-sm"
          >
            &larr; Back to Plans
          </Link>
          <h1 className="text-4xl font-bold text-[color:var(--foreground)] mt-2">
            Edit Plan: {plan.name}
          </h1>
          <p className="text-[color:var(--muted-foreground)] mt-1">Update pricing tier settings</p>
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
                  <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                </FormField>

                <FormField label="Plan Code" required htmlFor="code" error={errors.code}>
                  <Input id="code" value={data.code} onChange={(e) => setData('code', e.target.value)} />
                </FormField>
              </div>

              <FormField label="Description" htmlFor="description" error={errors.description}>
                <Textarea
                  id="description"
                  value={data.description}
                  onChange={(e) => setData('description', e.target.value)}
                />
              </FormField>

              <div className="flex items-center justify-between rounded-md border border-[color:var(--border)] p-3">
                <div>
                  <span className="text-[color:var(--foreground)]">Active</span>
                  <p className="text-[color:var(--muted-foreground)] text-sm">
                    Inactive plans cannot be assigned to schools
                  </p>
                </div>
                <Switch
                  checked={data.isActive}
                  onCheckedChange={(checked) => setData('isActive', checked)}
                />
              </div>
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
              {processing ? 'Saving...' : 'Save Changes'}
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

AdminPlansEditPage.layout = (page: ReactElement) => <AdminLayout>{page}</AdminLayout>

import { type ReactElement } from 'react'
import { Head, Link, useForm } from '@inertiajs/react'
import AdminLayout from '~/layouts/AdminLayout'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import type { School, SubscriptionPlan, SchoolSubscription } from '~/types'

export default function AdminSchoolSubscriptionPage({
  school,
  subscription,
  plans,
}: {
  school: School
  subscription: SchoolSubscription | null
  plans: SubscriptionPlan[]
}) {
  const isAssigning = !subscription
  const activePlans = plans.filter((p) => p.isActive)

  const { data, setData, post, put, transform, errors, processing } = useForm({
    planId: subscription?.planId || '',
    startDate: subscription?.startDate || new Date().toISOString().split('T')[0],
    endDate: subscription?.endDate || '',
    maxStudents: subscription?.maxStudents?.toString() || '',
    maxStaff: subscription?.maxStaff?.toString() || '',
    customPrice: subscription?.customPrice?.toString() || '',
    notes: subscription?.notes || '',
  })

  const selectedPlan = plans.find((p) => p.id === data.planId)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    transform((formData) => ({
      planId: formData.planId,
      startDate: formData.startDate,
      endDate: formData.endDate || undefined,
      maxStudents: formData.maxStudents ? parseInt(formData.maxStudents) : undefined,
      maxStaff: formData.maxStaff ? parseInt(formData.maxStaff) : undefined,
      customPrice: formData.customPrice ? parseFloat(formData.customPrice) : undefined,
      notes: formData.notes || undefined,
    }))

    if (isAssigning) {
      post(`/admin/schools/${school.id}/subscription`)
    } else {
      put(`/admin/schools/${school.id}/subscription`)
    }
  }

  function formatLimit(value: number) {
    return value === -1 ? 'Unlimited' : value.toString()
  }

  function statusBadge(status: string) {
    switch (status) {
      case 'active':
        return (
          <Badge className="bg-[color:var(--accent-foreground)/10] text-[color:var(--accent-foreground)] border-[color:var(--accent)]">
            Active
          </Badge>
        )
      case 'expired':
        return (
          <Badge className="bg-[color:var(--destructive)/10] text-[color:var(--destructive)] border-[color:var(--destructive)]">
            Expired
          </Badge>
        )
      case 'cancelled':
        return (
          <Badge className="bg-[color:var(--muted)/10] text-[color:var(--muted-foreground)] border-[color:var(--muted)]">
            Cancelled
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <>
      <Head title={`${school.name} - Subscription`} />

      {/* Centered container like create/edit page */}
      <div className="max-w-3xl mx-auto py-10 px-4 space-y-8">
        <div>
          <Link
            href={`/admin/schools/${school.id}`}
            className="text-[color:var(--primary)] hover:text-[color:var(--primary-foreground-link)] text-sm"
          >
            ← Back to School
          </Link>
          <h1 className="text-4xl font-bold text-[color:var(--foreground)] mt-2">
            {isAssigning ? 'Assign Subscription' : 'Update Subscription'}
          </h1>
          <p className="text-[color:var(--muted-foreground)] mt-1">Manage school subscription</p>
        </div>

        {/* Current Subscription Info */}
        {subscription && (
          <Card className="bg-[color:var(--card)] border-[color:var(--border)] shadow-md">
            <CardHeader className="flex justify-between items-center">
              <CardTitle className="text-[color:var(--card-foreground)]">
                Current Subscription
              </CardTitle>
              {statusBadge(subscription.status)}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-[color:var(--muted-foreground)] text-sm">Plan</p>
                  <p className="text-[color:var(--foreground)] font-medium">
                    {subscription.plan?.name || 'Custom'}
                  </p>
                </div>
                <div>
                  <p className="text-[color:var(--muted-foreground)] text-sm">Start Date</p>
                  <p className="text-[color:var(--foreground)]">{subscription.startDate}</p>
                </div>
                <div>
                  <p className="text-[color:var(--muted-foreground)] text-sm">End Date</p>
                  <p className="text-[color:var(--foreground)]">
                    {subscription.endDate || 'No expiry'}
                  </p>
                </div>
                <div>
                  <p className="text-[color:var(--muted-foreground)] text-sm">Custom Price</p>
                  <p className="text-[color:var(--foreground)]">
                    {subscription.customPrice != null
                      ? `$${subscription.customPrice.toFixed(2)}`
                      : 'Plan default'}
                  </p>
                </div>
              </div>

              {(subscription.maxStudents != null || subscription.maxStaff != null) && (
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <p className="text-[color:var(--muted-foreground)] text-sm">
                      Student Limit Override
                    </p>
                    <p className="text-[color:var(--foreground)]">
                      {subscription.maxStudents != null
                        ? formatLimit(subscription.maxStudents)
                        : 'Plan default'}
                    </p>
                  </div>
                  <div>
                    <p className="text-[color:var(--muted-foreground)] text-sm">
                      Staff Limit Override
                    </p>
                    <p className="text-[color:var(--foreground)]">
                      {subscription.maxStaff != null
                        ? formatLimit(subscription.maxStaff)
                        : 'Plan default'}
                    </p>
                  </div>
                </div>
              )}

              {subscription.notes && (
                <div>
                  <p className="text-[color:var(--muted-foreground)] text-sm">Notes</p>
                  <p className="text-[color:var(--foreground)]">{subscription.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Assign / Update Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="bg-[color:var(--card)] border-[color:var(--border)] shadow-md">
            <CardHeader>
              <CardTitle className="text-[color:var(--card-foreground)]">
                Subscription Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="planId" className="text-[color:var(--foreground)]">
                  Subscription Plan *
                </Label>
                <Select value={data.planId} onValueChange={(v) => setData('planId', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a plan" />
                  </SelectTrigger>
                  <SelectContent>
                    {activePlans.map((plan) => (
                      <SelectItem key={plan.id} value={plan.id}>
                        {plan.name} — ${plan.priceMonthly.toFixed(2)}/mo
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.planId && (
                  <p className="text-[color:var(--destructive)] text-sm">{errors.planId}</p>
                )}
              </div>

              {selectedPlan && (
                <div className="text-sm space-y-1">
                  <p className="text-[color:var(--muted-foreground)]">
                    <span className="text-[color:var(--foreground)] font-medium">
                      {selectedPlan.name}
                    </span>{' '}
                    — Max {formatLimit(selectedPlan.maxStudents)} students,{' '}
                    {formatLimit(selectedPlan.maxStaff)} staff
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate" className="text-[color:var(--foreground)]">
                    Start Date *
                  </Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={data.startDate}
                    onChange={(e) => setData('startDate', e.target.value)}
                  />
                  {errors.startDate && (
                    <p className="text-[color:var(--destructive)] text-sm">{errors.startDate}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate" className="text-[color:var(--foreground)]">
                    End Date
                  </Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={data.endDate}
                    onChange={(e) => setData('endDate', e.target.value)}
                  />
                  {errors.endDate && (
                    <p className="text-[color:var(--destructive)] text-sm">{errors.endDate}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[color:var(--card)] border-[color:var(--border)] shadow-md">
            <CardHeader>
              <CardTitle className="text-[color:var(--card-foreground)]">
                Custom Overrides
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxStudents" className="text-[color:var(--foreground)]">
                    Max Students
                  </Label>
                  <Input
                    id="maxStudents"
                    type="number"
                    value={data.maxStudents}
                    onChange={(e) => setData('maxStudents', e.target.value)}
                    placeholder="Use plan default"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxStaff" className="text-[color:var(--foreground)]">
                    Max Staff
                  </Label>
                  <Input
                    id="maxStaff"
                    type="number"
                    value={data.maxStaff}
                    onChange={(e) => setData('maxStaff', e.target.value)}
                    placeholder="Use plan default"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="customPrice" className="text-[color:var(--foreground)]">
                  Custom Price ($)
                </Label>
                <Input
                  id="customPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={data.customPrice}
                  onChange={(e) => setData('customPrice', e.target.value)}
                  placeholder="Use plan default"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes" className="text-[color:var(--foreground)]">
                  Notes
                </Label>
                <Textarea
                  id="notes"
                  value={data.notes}
                  onChange={(e) => setData('notes', e.target.value)}
                  placeholder="Internal notes"
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button type="submit" disabled={processing}>
              {processing
                ? 'Saving...'
                : isAssigning
                  ? 'Assign Subscription'
                  : 'Update Subscription'}
            </Button>
            <Link href={`/admin/schools/${school.id}`}>
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

AdminSchoolSubscriptionPage.layout = (page: ReactElement) => <AdminLayout>{page}</AdminLayout>

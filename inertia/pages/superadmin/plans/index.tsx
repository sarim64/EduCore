import { type ReactElement } from 'react'
import { Head, Link, router } from '@inertiajs/react'
import AdminLayout from '~/layouts/AdminLayout'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'
import type { SubscriptionPlan } from '~/types'

export default function AdminPlansIndexPage({ plans }: { plans: SubscriptionPlan[] }) {
  const handleDelete = (plan: SubscriptionPlan) => {
    if (confirm(`Are you sure you want to delete the plan "${plan.name}"?`)) {
      router.delete(`/admin/plans/${plan.id}`)
    }
  }

  function formatLimit(value: number) {
    return value === -1 ? 'Unlimited' : value.toString()
  }

  return (
    <>
      <Head title="Subscription Plans" />

      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-foreground)]">
              Subscription Plans
            </h1>
            <p className="text-[var(--color-muted-foreground)] mt-1">
              Manage pricing tiers and feature sets
            </p>
          </div>
          <Link href="/admin/plans/create">
            <Button>Create Plan</Button>
          </Link>
        </div>

        {/* Plans Table */}
        <div className="bg-[var(--color-card)] rounded-lg border border-[var(--color-border)] overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-[var(--color-border)] bg-[var(--color-muted)]">
                <TableHead className="text-[var(--color-muted-foreground)]">Name</TableHead>
                <TableHead className="text-[var(--color-muted-foreground)]">Code</TableHead>
                <TableHead className="text-[var(--color-muted-foreground)]">Monthly</TableHead>
                <TableHead className="text-[var(--color-muted-foreground)]">Yearly</TableHead>
                <TableHead className="text-[var(--color-muted-foreground)]">Students</TableHead>
                <TableHead className="text-[var(--color-muted-foreground)]">Staff</TableHead>
                <TableHead className="text-[var(--color-muted-foreground)]">Status</TableHead>
                <TableHead className="text-[var(--color-muted-foreground)] text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.length === 0 ? (
                <TableRow className="border-[var(--color-border)]">
                  <TableCell
                    colSpan={8}
                    className="text-center text-[var(--color-muted-foreground)] py-8"
                  >
                    No plans found. Create your first subscription plan to get started.
                  </TableCell>
                </TableRow>
              ) : (
                plans.map((plan) => (
                  <TableRow
                    key={plan.id}
                    className="border-[var(--color-border)] hover:bg-[var(--color-muted)]"
                  >
                    <TableCell className="text-[var(--color-foreground)] font-medium">
                      {plan.name}
                    </TableCell>
                    <TableCell className="text-[var(--color-muted-foreground)] font-mono text-sm">
                      {plan.code}
                    </TableCell>
                    <TableCell className="text-[var(--color-muted-foreground)]">
                      ${plan.priceMonthly.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-[var(--color-muted-foreground)]">
                      ${plan.priceYearly.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-[var(--color-muted-foreground)]">
                      {formatLimit(plan.maxStudents)}
                    </TableCell>
                    <TableCell className="text-[var(--color-muted-foreground)]">
                      {formatLimit(plan.maxStaff)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          plan.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }
                      >
                        {plan.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right space-x-2">
                      <Link href={`/admin/plans/${plan.id}/edit`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-[var(--color-muted-foreground)] hover:bg-purple-100 hover:text-purple-700"
                        >
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:bg-red-100 hover:text-red-700"
                        onClick={() => handleDelete(plan)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  )
}

AdminPlansIndexPage.layout = (page: ReactElement) => <AdminLayout>{page}</AdminLayout>

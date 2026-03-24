import { ReactElement, useState } from 'react'
import { Head, router } from '@inertiajs/react'
import DashboardLayout from '~/layouts/DashboardLayout'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { FormField } from '~/components/FormField'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'
import type {
  FeeCollectionPayment,
  FeeCollectionSummary,
  FeeCollectionGroupedItem,
  FeeCollectionFilters,
} from '~/types/fees'
import type { AcademicYear, SchoolClass } from '~/types/academics'

export default function FeeCollectionReportPage({
  payments,
  summary,
  groupedData,
  academicYears,
  classes,
  filters,
}: {
  payments: FeeCollectionPayment[]
  summary: FeeCollectionSummary
  groupedData: FeeCollectionGroupedItem[]
  academicYears: AcademicYear[]
  classes: SchoolClass[]
  filters: FeeCollectionFilters
}) {
  const [filterValues, setFilterValues] = useState({
    academicYearId: filters.academicYearId || '',
    classId: filters.classId || '',
    startDate: filters.startDate || '',
    endDate: filters.endDate || '',
    groupBy: filters.groupBy || 'day',
  })

  function handleFilter(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    router.get('/fees/reports/collection', {
      academicYearId: filterValues.academicYearId,
      classId: filterValues.classId,
      startDate: filterValues.startDate,
      endDate: filterValues.endDate,
      groupBy: filterValues.groupBy,
    })
  }

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <>
      <Head title="Fee Collection Report" />

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Fee Collection Report</h1>
        </div>

        <Card>
          <CardContent className="py-4">
            <form onSubmit={handleFilter} className="grid grid-cols-1 gap-4 md:grid-cols-6 md:items-end">
              <FormField label="Academic Year" className="md:col-span-1">
                <Select
                  value={filterValues.academicYearId || 'all'}
                  onValueChange={(value) =>
                    setFilterValues((prev) => ({
                      ...prev,
                      academicYearId: value === 'all' ? '' : value,
                    }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Academic Years" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Academic Years</SelectItem>
                    {academicYears.map((year) => (
                      <SelectItem key={year.id} value={year.id}>
                        {year.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label="Class" className="md:col-span-1">
                <Select
                  value={filterValues.classId || 'all'}
                  onValueChange={(value) =>
                    setFilterValues((prev) => ({
                      ...prev,
                      classId: value === 'all' ? '' : value,
                    }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Classes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Classes</SelectItem>
                    {classes.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id}>
                        {cls.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label="Start Date" className="md:col-span-1">
                <Input
                  type="date"
                  value={filterValues.startDate}
                  onChange={(e) =>
                    setFilterValues((prev) => ({
                      ...prev,
                      startDate: e.target.value,
                    }))
                  }
                />
              </FormField>

              <FormField label="End Date" className="md:col-span-1">
                <Input
                  type="date"
                  value={filterValues.endDate}
                  onChange={(e) =>
                    setFilterValues((prev) => ({
                      ...prev,
                      endDate: e.target.value,
                    }))
                  }
                />
              </FormField>

              <FormField label="Group By" className="md:col-span-1">
                <Select
                  value={filterValues.groupBy}
                  onValueChange={(value) =>
                    setFilterValues((prev) => ({
                      ...prev,
                      groupBy: value,
                    }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Group by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">Group by Day</SelectItem>
                    <SelectItem value="month">Group by Month</SelectItem>
                    <SelectItem value="class">Group by Class</SelectItem>
                    <SelectItem value="paymentMethod">Group by Payment Method</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>

              <div className="md:col-span-1">
                <Button type="submit" className="w-full">
                  Apply Filters
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-gray-500">Total Collected</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(summary.totalCollected)}
              </p>
              <p className="text-sm text-gray-500">{summary.totalTransactions} transactions</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-gray-500">Total Outstanding</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-red-600">
                {formatCurrency(summary.totalOutstanding)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-gray-500">Collection Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-600">
                {summary.totalCollected + summary.totalOutstanding > 0
                  ? Math.round(
                      (summary.totalCollected /
                        (summary.totalCollected + summary.totalOutstanding)) *
                        100
                    )
                  : 0}
                %
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>By Payment Method</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {Object.entries(summary.byPaymentMethod).map(([method, data]) => (
                <div key={method} className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 capitalize">{method.replace('_', ' ')}</p>
                  <p className="text-lg font-bold">{formatCurrency(data.amount)}</p>
                  <p className="text-xs text-gray-400">{data.count} transactions</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Collection by {filterValues.groupBy}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{filters.groupBy}</TableHead>
                  <TableHead className="text-right">Transactions</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {groupedData.map((row) => (
                  <TableRow key={row.label}>
                    <TableCell>{row.label}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{row.count}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(row.amount)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Receipt #</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.slice(0, 10).map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">{payment.receiptNumber}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {payment.student
                        ? `${payment.student.firstName} ${payment.student.lastName || ''}`
                        : '-'}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{payment.paymentDate}</TableCell>
                    <TableCell className="capitalize text-muted-foreground">
                      {payment.paymentMethod.replace('_', ' ')}
                    </TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(payment.amount)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

FeeCollectionReportPage.layout = (page: ReactElement) => <DashboardLayout>{page}</DashboardLayout>

import { ReactElement, useState } from 'react'
import { Head, Link, router } from '@inertiajs/react'
import DashboardLayout from '~/layouts/DashboardLayout'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { FormField } from '~/components/FormField'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'
import type { FeeDefaulter, FeeDefaultersSummary, FeeDefaultersFilters } from '~/types/fees'
import type { AcademicYear, SchoolClass } from '~/types/academics'

export default function DefaultersReportPage({
  defaulters,
  summary,
  academicYears,
  classes,
  filters,
}: {
  defaulters: FeeDefaulter[]
  summary: FeeDefaultersSummary
  academicYears: AcademicYear[]
  classes: SchoolClass[]
  filters: FeeDefaultersFilters
}) {
  const [filterValues, setFilterValues] = useState({
    academicYearId: filters.academicYearId || '',
    classId: filters.classId || '',
    minOverdueMonths: String(filters.minOverdueMonths || '1'),
  })

  function handleFilter(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    router.get('/fees/reports/defaulters', {
      academicYearId: filterValues.academicYearId,
      classId: filterValues.classId,
      minOverdueMonths: filterValues.minOverdueMonths,
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
      <Head title="Fee Defaulters Report" />

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Fee Defaulters Report</h1>
        </div>

        <Card>
          <CardContent className="py-4">
            <form
              onSubmit={handleFilter}
              className="grid grid-cols-1 gap-4 md:grid-cols-4 md:items-end"
            >
              <FormField label="Academic Year">
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

              <FormField label="Class">
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

              <FormField label="Minimum Overdue">
                <Select
                  value={filterValues.minOverdueMonths}
                  onValueChange={(value) =>
                    setFilterValues((prev) => ({
                      ...prev,
                      minOverdueMonths: value,
                    }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select overdue threshold" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1+ Months Overdue</SelectItem>
                    <SelectItem value="2">2+ Months Overdue</SelectItem>
                    <SelectItem value="3">3+ Months Overdue</SelectItem>
                    <SelectItem value="6">6+ Months Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>

              <Button type="submit" className="w-full">
                Apply Filters
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-gray-500">Total Defaulters</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-red-600">{summary.totalDefaulters}</p>
              <p className="text-sm text-gray-500">students with overdue fees</p>
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
              <CardTitle className="text-sm text-gray-500">Avg. Overdue Months</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-orange-600">{summary.avgOverdueMonths}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Defaulters by Class</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(summary.byClass).map(([className, data]) => (
                <div key={className} className="text-center p-4 bg-red-50 rounded-lg">
                  <p className="text-sm text-gray-600">{className}</p>
                  <p className="text-xl font-bold text-red-600">{data.count}</p>
                  <p className="text-sm text-gray-500">{formatCurrency(data.amount)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Defaulters List</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead className="text-center">Overdue Months</TableHead>
                  <TableHead className="text-right">Amount Due</TableHead>
                  <TableHead>Last Payment</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {defaulters.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                      No defaulters found.
                    </TableCell>
                  </TableRow>
                ) : (
                  defaulters.map((defaulter) => (
                    <TableRow key={defaulter.student.id}>
                      <TableCell>
                        <div className="text-sm font-medium">
                          {defaulter.student.firstName} {defaulter.student.lastName}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {defaulter.student.studentId}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {defaulter.className}
                        {defaulter.sectionName && ` - ${defaulter.sectionName}`}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={defaulter.overdueMonths >= 3 ? 'destructive' : 'secondary'}
                          className="font-normal"
                        >
                          {defaulter.overdueMonths} months
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-sm font-bold text-red-600">
                        {formatCurrency(defaulter.totalDue)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {defaulter.lastPaymentDate || 'Never'}
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`/fees/ledger/${defaulter.student.id}`}>
                          <Button variant="outline" size="sm">
                            View Ledger
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

DefaultersReportPage.layout = (page: ReactElement) => <DashboardLayout>{page}</DashboardLayout>

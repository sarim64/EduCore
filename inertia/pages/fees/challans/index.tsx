import { ReactElement } from 'react'
import { Head, Link, router } from '@inertiajs/react'
import DashboardLayout from '~/layouts/DashboardLayout'
import { Button } from '~/components/ui/button'
import { Card, CardContent } from '~/components/ui/card'
import type { FeeChallan } from '~/types/fees'
import type { SchoolClass, AcademicYear } from '~/types/academics'
import type { PaginationMeta } from '~/types/admin'

export default function FeeChallansIndexPage({
  challans,
  academicYears,
  classes,
  filters,
  statuses,
}: {
  challans: { data: FeeChallan[]; meta: PaginationMeta }
  academicYears: AcademicYear[]
  classes: SchoolClass[]
  filters: { academicYearId: string; classId: string; status: string }
  statuses: string[]
}) {
  function handleFilter(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    router.get('/fees/challans', {
      academicYearId: formData.get('academicYearId') as string,
      classId: formData.get('classId') as string,
      status: formData.get('status') as string,
    })
  }

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800'
      case 'partial':
        return 'bg-yellow-100 text-yellow-800'
      case 'overdue':
        return 'bg-red-100 text-red-800'
      case 'cancelled':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-blue-100 text-blue-800'
    }
  }

  return (
    <>
      <Head title="Fee Challans" />

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Fee Challans</h1>
          <div className="flex gap-2">
            <Link href="/fees/challans/bulk-create">
              <Button variant="outline">Bulk Generate</Button>
            </Link>
            <Link href="/fees/challans/create">
              <Button>Generate Challan</Button>
            </Link>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="py-4">
            <form onSubmit={handleFilter} className="flex gap-4 flex-wrap">
              <select
                name="academicYearId"
                defaultValue={filters.academicYearId}
                className="px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">All Academic Years</option>
                {academicYears.map((year) => (
                  <option key={year.id} value={year.id}>
                    {year.name}
                  </option>
                ))}
              </select>
              <select
                name="classId"
                defaultValue={filters.classId}
                className="px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">All Classes</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </select>
              <select
                name="status"
                defaultValue={filters.status}
                className="px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">All Statuses</option>
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
              <Button type="submit">Filter</Button>
            </form>
          </CardContent>
        </Card>

        {/* Challans Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Challan #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Period
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Due Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Amount
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Balance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {challans.data.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                    No challans found.
                  </td>
                </tr>
              ) : (
                challans.data.map((challan) => (
                  <tr key={challan.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {challan.challanNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {challan.student && (
                        <>
                          <div className="text-sm font-medium text-gray-900">
                            {challan.student.firstName} {challan.student.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{challan.student.studentId}</div>
                        </>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {challan.period}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {challan.dueDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {formatCurrency(challan.netAmount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                      <span
                        className={challan.balanceAmount > 0 ? 'text-red-600' : 'text-green-600'}
                      >
                        {formatCurrency(challan.balanceAmount)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${getStatusColor(challan.status)}`}
                      >
                        {challan.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <Link href={`/fees/challans/${challan.id}`}>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </Link>
                        {challan.status !== 'paid' && challan.status !== 'cancelled' && (
                          <Link href={`/fees/payments/challan/${challan.id}/create`}>
                            <Button size="sm">Pay</Button>
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {challans.meta.lastPage > 1 && (
          <div className="flex justify-center gap-2">
            {Array.from({ length: challans.meta.lastPage }, (_, i) => i + 1).map((page) => (
              <Link
                key={page}
                href={`/fees/challans?page=${page}&academicYearId=${filters.academicYearId}&classId=${filters.classId}&status=${filters.status}`}
                className={`px-3 py-1 rounded ${
                  page === challans.meta.currentPage
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {page}
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

FeeChallansIndexPage.layout = (page: ReactElement) => <DashboardLayout>{page}</DashboardLayout>

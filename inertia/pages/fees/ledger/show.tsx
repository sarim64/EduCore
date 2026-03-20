import { ReactElement } from 'react'
import { Head, Link, router } from '@inertiajs/react'
import DashboardLayout from '~/layouts/DashboardLayout'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import type { FeeChallanStudent, FeeChallan, FeePayment, FeeLedgerSummary } from '~/types/fees'
import type { AcademicYear } from '~/types/academics'

export default function StudentFeeLedgerPage({
  student,
  challans,
  payments,
  summary,
  academicYears,
  filters,
}: {
  student: FeeChallanStudent
  challans: FeeChallan[]
  payments: FeePayment[]
  summary: FeeLedgerSummary
  academicYears: AcademicYear[]
  filters: { academicYearId: string }
}) {
  function handleFilter(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    router.get(`/fees/ledger/${student.id}`, {
      academicYearId: formData.get('academicYearId') as string,
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
      <Head title={`Fee Ledger - ${student.firstName} ${student.lastName || ''}`} />

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">
              Fee Ledger: {student.firstName} {student.lastName}
            </h1>
            <p className="text-gray-500">Student ID: {student.studentId}</p>
          </div>
          <Link href="/fees/challans">
            <Button variant="outline">Back to Challans</Button>
          </Link>
        </div>

        {/* Filter */}
        <Card>
          <CardContent className="py-4">
            <form onSubmit={handleFilter} className="flex gap-4">
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
              <Button type="submit">Filter</Button>
            </form>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-gray-500">Total Fees</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{formatCurrency(summary.totalPayable)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-gray-500">Total Paid</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(summary.totalPaid)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-gray-500">Balance Due</CardTitle>
            </CardHeader>
            <CardContent>
              <p
                className={`text-2xl font-bold ${summary.totalBalance > 0 ? 'text-red-600' : 'text-green-600'}`}
              >
                {formatCurrency(summary.totalBalance)}
              </p>
            </CardContent>
          </Card>
          <Card className={summary.isDefaulter ? 'border-red-500 bg-red-50' : ''}>
            <CardHeader>
              <CardTitle className="text-sm text-gray-500">Status</CardTitle>
            </CardHeader>
            <CardContent>
              {summary.isDefaulter ? (
                <div>
                  <p className="text-xl font-bold text-red-600">DEFAULTER</p>
                  <p className="text-sm text-red-500">{summary.overdueMonths} months overdue</p>
                </div>
              ) : (
                <p className="text-xl font-bold text-green-600">Regular</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Challans */}
        <Card>
          <CardHeader>
            <CardTitle>Fee Challans</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Challan #
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
                    Paid
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
                {challans.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                      No challans found.
                    </td>
                  </tr>
                ) : (
                  challans.map((challan) => (
                    <tr key={challan.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {challan.challanNumber}
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 text-right">
                        {formatCurrency(challan.paidAmount)}
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
                        <Link href={`/fees/challans/${challan.id}`}>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Payment History */}
        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Receipt #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Method
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                      No payments recorded.
                    </td>
                  </tr>
                ) : (
                  payments.map((payment) => (
                    <tr key={payment.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {payment.receiptNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {payment.paymentDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                        {payment.paymentMethod.replace('_', ' ')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600 text-right">
                        {formatCurrency(payment.amount)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

StudentFeeLedgerPage.layout = (page: ReactElement) => <DashboardLayout>{page}</DashboardLayout>

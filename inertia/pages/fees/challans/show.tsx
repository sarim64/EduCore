import { ReactElement } from 'react'
import { Head, Link, useForm } from '@inertiajs/react'
import DashboardLayout from '~/layouts/DashboardLayout'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import type { FeeChallan, FeeChallanItem, FeePayment } from '~/types/fees'

export default function FeeChallanShowPage({
  challan,
}: {
  challan: FeeChallan & { items: FeeChallanItem[]; payments: FeePayment[] }
}) {
  const { post, processing } = useForm()

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

  function handleCancel() {
    if (confirm('Are you sure you want to cancel this challan?')) {
      post(`/fees/challans/${challan.id}/cancel`)
    }
  }

  return (
    <>
      <Head title={`Challan ${challan.challanNumber}`} />

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Challan #{challan.challanNumber}</h1>
            <p className="text-gray-500">Period: {challan.period}</p>
          </div>
          <div className="flex gap-2">
            <Link href="/fees/challans">
              <Button variant="outline">Back to List</Button>
            </Link>
            {challan.status !== 'paid' && challan.status !== 'cancelled' && (
              <>
                <Link href={`/fees/payments/challan/${challan.id}/create`}>
                  <Button>Record Payment</Button>
                </Link>
                <Button variant="destructive" onClick={handleCancel} disabled={processing}>
                  Cancel Challan
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Student Info */}
          <Card>
            <CardHeader>
              <CardTitle>Student Information</CardTitle>
            </CardHeader>
            <CardContent>
              {challan.student && (
                <div className="space-y-2">
                  <p className="font-medium">
                    {challan.student.firstName} {challan.student.lastName}
                  </p>
                  <p className="text-sm text-gray-500">ID: {challan.student.studentId}</p>
                  <Link
                    href={`/fees/ledger/${challan.student.id}`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    View Full Ledger
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Challan Details */}
          <Card>
            <CardHeader>
              <CardTitle>Challan Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Issue Date:</span>
                  <span>{challan.issueDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Due Date:</span>
                  <span>{challan.dueDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Status:</span>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${getStatusColor(challan.status)}`}
                  >
                    {challan.status}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Amount Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Amount Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Total Fees:</span>
                  <span>{formatCurrency(challan.totalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Discount:</span>
                  <span className="text-green-600">-{formatCurrency(challan.discountAmount)}</span>
                </div>
                {challan.lateFeeAmount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Late Fee:</span>
                    <span className="text-red-600">+{formatCurrency(challan.lateFeeAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold border-t pt-2">
                  <span>Net Amount:</span>
                  <span>{formatCurrency(challan.netAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Paid:</span>
                  <span className="text-green-600">{formatCurrency(challan.paidAmount)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Balance:</span>
                  <span className={challan.balanceAmount > 0 ? 'text-red-600' : 'text-green-600'}>
                    {formatCurrency(challan.balanceAmount)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Fee Items */}
        <Card>
          <CardHeader>
            <CardTitle>Fee Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Fee Category
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Discount
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Net
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {challan.items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.feeCategory?.name || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      {formatCurrency(item.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 text-right">
                      {item.discountAmount > 0 ? `-${formatCurrency(item.discountAmount)}` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                      {formatCurrency(item.netAmount)}
                    </td>
                  </tr>
                ))}
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
            {challan.payments.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No payments recorded yet.</p>
            ) : (
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
                  {challan.payments.map((payment) => (
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
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}

FeeChallanShowPage.layout = (page: ReactElement) => <DashboardLayout>{page}</DashboardLayout>

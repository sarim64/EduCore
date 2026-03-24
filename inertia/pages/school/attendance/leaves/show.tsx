import { FormEvent, ReactElement } from 'react'
import { Head, Link, router, useForm } from '@inertiajs/react'
import DashboardLayout from '~/layouts/DashboardLayout'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { FormField } from '~/components/FormField'
import { Textarea } from '~/components/ui/textarea'
import type { LeaveApplication } from '~/types/attendance'

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  cancelled: 'bg-gray-100 text-gray-800',
}

export default function ShowLeaveApplicationPage({
  application,
  errors: serverErrors,
}: {
  application: LeaveApplication
  errors?: Record<string, string>
}) {
  const { data, setData, post, processing } = useForm({
    reviewerRemarks: '',
  })

  function handleApprove(e: FormEvent) {
    e.preventDefault()
    post(`/attendance/leaves/${application.id}/approve`)
  }

  function handleReject(e: FormEvent) {
    e.preventDefault()
    post(`/attendance/leaves/${application.id}/reject`)
  }

  function handleCancel() {
    if (confirm('Are you sure you want to cancel this leave application?')) {
      router.post(`/attendance/leaves/${application.id}/cancel`)
    }
  }

  return (
    <>
      <Head title="Leave Application Details" />

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Leave Application Details</h1>
          <Link href="/attendance/leaves">
            <Button variant="outline">Back to Applications</Button>
          </Link>
        </div>

        {serverErrors?.general && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">{serverErrors.general}</p>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Application Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="font-medium text-gray-500">Status:</span>
                <Badge
                  className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${statusColors[application.status]}`}
                >
                  {application.status}
                </Badge>
              </div>
              <div>
                <span className="font-medium text-gray-500">Staff:</span>
                <span className="ml-2">
                  {application.staff
                    ? `${application.staff.firstName} ${application.staff.lastName ?? ''}`
                    : 'N/A'}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-500">Staff ID:</span>
                <span className="ml-2">{application.staff?.staffMemberId ?? 'N/A'}</span>
              </div>
              <div>
                <span className="font-medium text-gray-500">Leave Type:</span>
                <span className="ml-2">
                  {application.leaveType
                    ? `${application.leaveType.name} (${application.leaveType.code})`
                    : 'N/A'}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Leave Period</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="font-medium text-gray-500">Start Date:</span>
                <span className="ml-2">{application.startDate}</span>
              </div>
              <div>
                <span className="font-medium text-gray-500">End Date:</span>
                <span className="ml-2">{application.endDate}</span>
              </div>
              <div>
                <span className="font-medium text-gray-500">Total Days:</span>
                <span className="ml-2">{application.totalDays}</span>
              </div>
              <div>
                <span className="font-medium text-gray-500">Applied On:</span>
                <span className="ml-2">{application.appliedOn}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Reason</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-wrap">{application.reason}</p>
            </CardContent>
          </Card>

          {(application.status === 'approved' || application.status === 'rejected') && (
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Review Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <span className="font-medium text-gray-500">Reviewed At:</span>
                  <span className="ml-2">{application.reviewedAt ?? 'N/A'}</span>
                </div>
                {application.reviewerRemarks && (
                  <div>
                    <span className="font-medium text-gray-500">Remarks:</span>
                    <p className="mt-1 text-gray-700">{application.reviewerRemarks}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {application.status === 'pending' && (
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField label="Remarks (Optional)" htmlFor="reviewerRemarks">
                  <Textarea
                    id="reviewerRemarks"
                    value={data.reviewerRemarks}
                    onChange={(e) => setData('reviewerRemarks', e.target.value)}
                    placeholder="Add any remarks for this decision"
                    rows={3}
                  />
                </FormField>
                <div className="flex gap-4">
                  <form onSubmit={handleApprove}>
                    <input type="hidden" name="reviewerRemarks" value={data.reviewerRemarks} />
                    <Button
                      type="submit"
                      disabled={processing}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Approve
                    </Button>
                  </form>
                  <form onSubmit={handleReject}>
                    <input type="hidden" name="reviewerRemarks" value={data.reviewerRemarks} />
                    <Button type="submit" disabled={processing} variant="destructive">
                      Reject
                    </Button>
                  </form>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={processing}
                  >
                    Cancel Application
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  )
}

ShowLeaveApplicationPage.layout = (page: ReactElement) => <DashboardLayout>{page}</DashboardLayout>

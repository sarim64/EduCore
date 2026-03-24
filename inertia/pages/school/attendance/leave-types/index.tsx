import { ReactElement } from 'react'
import { Head, Link, useForm } from '@inertiajs/react'
import DashboardLayout from '~/layouts/DashboardLayout'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'

import type { LeaveType } from '~/types/attendance'

export default function LeaveTypesIndexPage({ leaveTypes }: { leaveTypes: LeaveType[] }) {
  const { delete: destroy, processing } = useForm()

  function handleDelete(id: string) {
    if (confirm('Are you sure you want to delete this leave type?')) {
      destroy(`/attendance/leave-types/${id}`)
    }
  }

  function getAppliesToLabel(appliesTo: string) {
    switch (appliesTo) {
      case 'all':
        return 'All Staff'
      case 'teaching':
        return 'Teaching Staff'
      case 'non_teaching':
        return 'Non-Teaching Staff'
      default:
        return appliesTo
    }
  }

  return (
    <>
      <Head title="Leave Types" />

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Leave Types</h1>
          <Link href="/attendance/leave-types/create">
            <Button>Add Leave Type</Button>
          </Link>
        </div>

        <div className="grid gap-4">
          {leaveTypes.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-gray-500">
                No leave types found. Create one to get started.
              </CardContent>
            </Card>
          ) : (
            leaveTypes.map((leaveType) => (
              <Card key={leaveType.id}>
                <CardHeader className="flex flex-row items-center justify-between py-4">
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-lg">
                      {leaveType.name} ({leaveType.code})
                    </CardTitle>
                    <Badge
                      className={`px-2 py-1 text-xs rounded-full ${
                        leaveType.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {leaveType.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    {leaveType.isPaid && (
                      <Badge className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                        Paid
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/attendance/leave-types/${leaveType.id}/edit`}>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(leaveType.id)}
                      disabled={processing}
                    >
                      Delete
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="py-2">
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Allowed Days: {leaveType.allowedDays}</p>
                    <p>Applies To: {getAppliesToLabel(leaveType.appliesTo ?? 'all')}</p>
                    {leaveType.description && <p>{leaveType.description}</p>}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </>
  )
}

LeaveTypesIndexPage.layout = (page: ReactElement) => <DashboardLayout>{page}</DashboardLayout>

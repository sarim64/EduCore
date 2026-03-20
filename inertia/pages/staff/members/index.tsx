import { ReactElement } from 'react'
import { Head, Link, useForm } from '@inertiajs/react'
import DashboardLayout from '~/layouts/DashboardLayout'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import type { StaffMember } from '~/types/staff'

export default function StaffIndexPage({ staff }: { staff: StaffMember[] }) {
  const { delete: destroy, processing } = useForm()

  function handleDelete(id: string) {
    if (confirm('Are you sure you want to delete this staff member?')) {
      destroy(`/staff/members/${id}`)
    }
  }

  return (
    <>
      <Head title="Staff Members" />

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Staff Members</h1>
          <Link href="/staff/members/create">
            <Button>Add Staff Member</Button>
          </Link>
        </div>

        <div className="grid gap-4">
          {staff.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-gray-500">
                No staff members found. Create one to get started.
              </CardContent>
            </Card>
          ) : (
            staff.map((member) => (
              <Card key={member.id}>
                <CardHeader className="flex flex-row items-center justify-between py-4">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {member.fullName}
                      <span className="text-sm font-normal text-gray-500">
                        ({member.staffMemberId})
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded ${member.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}
                      >
                        {member.status}
                      </span>
                    </CardTitle>
                    <div className="text-sm text-gray-600 mt-1 space-y-1">
                      {member.department && <p>Department: {member.department.name}</p>}
                      {member.designation && <p>Designation: {member.designation.name}</p>}
                      {member.email && <p>Email: {member.email}</p>}
                      {member.phone && <p>Phone: {member.phone}</p>}
                      <p>Type: {member.employmentType}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/staff/members/${member.id}`}>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </Link>
                    <Link href={`/staff/members/${member.id}/edit`}>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(member.id)}
                      disabled={processing}
                    >
                      Delete
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            ))
          )}
        </div>
      </div>
    </>
  )
}

StaffIndexPage.layout = (page: ReactElement) => <DashboardLayout>{page}</DashboardLayout>

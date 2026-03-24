import { ReactElement } from 'react'
import { Head, Link, useForm } from '@inertiajs/react'
import DashboardLayout from '~/layouts/DashboardLayout'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import type { StaffMember } from '~/types/staff'

export default function ShowStaffPage({ staff }: { staff: StaffMember }) {
  const { post, processing } = useForm()

  function handleUnlinkUser() {
    if (
      confirm(
        'Are you sure you want to unlink the user account? The user will lose access to this school.'
      )
    ) {
      post(`/staff/members/${staff.id}/unlink-user`)
    }
  }

  return (
    <>
      <Head title={`Staff - ${staff.fullName}`} />

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Link href="/staff/members" className="text-blue-600 hover:underline text-sm">
              &larr; Back to Staff Members
            </Link>
            <h1 className="text-2xl font-bold mt-2">{staff.fullName}</h1>
            <p className="text-gray-500">{staff.staffMemberId}</p>
          </div>
          <div className="flex gap-2">
            <Link href={`/staff/members/${staff.id}/edit`}>
              <Button variant="outline">Edit</Button>
            </Link>
            <Link href={`/staff/members/${staff.id}/qualifications`}>
              <Button variant="outline">Qualifications</Button>
            </Link>
            <Link href={`/staff/members/${staff.id}/documents`}>
              <Button variant="outline">Documents</Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <InfoRow label="Full Name" value={staff.fullName} />
              <InfoRow label="Date of Birth" value={staff.dateOfBirth} />
              <InfoRow label="Gender" value={staff.gender} />
              <InfoRow label="Blood Group" value={staff.bloodGroup} />
              <InfoRow label="Marital Status" value={staff.maritalStatus} />
              <InfoRow label="Nationality" value={staff.nationality} />
              <InfoRow label="National ID" value={staff.nationalId} />
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <InfoRow label="Email" value={staff.email} />
              <InfoRow label="Phone" value={staff.phone} />
              <InfoRow label="Alternate Phone" value={staff.alternatePhone} />
              <InfoRow label="Address" value={staff.address} />
              <InfoRow
                label="Location"
                value={[staff.city, staff.state, staff.country].filter(Boolean).join(', ') || null}
              />
              <InfoRow label="Postal Code" value={staff.postalCode} />
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          <Card>
            <CardHeader>
              <CardTitle>Emergency Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <InfoRow label="Name" value={staff.emergencyContactName} />
              <InfoRow label="Phone" value={staff.emergencyContactPhone} />
              <InfoRow label="Relation" value={staff.emergencyContactRelation} />
            </CardContent>
          </Card>

          {/* Employment Information */}
          <Card>
            <CardHeader>
              <CardTitle>Employment Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <InfoRow label="Department" value={staff.department?.name} />
              <InfoRow label="Designation" value={staff.designation?.name} />
              <InfoRow label="Joining Date" value={staff.joiningDate} />
              <InfoRow label="Employment Type" value={staff.employmentType} />
              <InfoRow
                label="Status"
                value={
                  <span
                    className={`px-2 py-1 rounded text-xs ${staff.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}
                  >
                    {staff.status}
                  </span>
                }
              />
              <InfoRow
                label="Basic Salary"
                value={`PKR ${(staff.basicSalary ?? 0).toLocaleString()}`}
              />
              <InfoRow label="Bank Name" value={staff.bankName} />
              <InfoRow label="Account Number" value={staff.bankAccountNumber} />
            </CardContent>
          </Card>

          {/* User Account */}
          <Card>
            <CardHeader>
              <CardTitle>User Account</CardTitle>
            </CardHeader>
            <CardContent>
              {staff.user ? (
                <div className="space-y-3">
                  <InfoRow label="Name" value={staff.user.fullName} />
                  <InfoRow label="Email" value={staff.user.email} />
                  <InfoRow
                    label="Status"
                    value={
                      <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                        Linked
                      </span>
                    }
                  />
                  <div className="pt-2">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleUnlinkUser}
                      disabled={processing}
                    >
                      {processing ? 'Unlinking...' : 'Unlink Account'}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500 mb-4">
                    No user account linked. Link an account to allow this staff member to log in.
                  </p>
                  <Link href={`/staff/members/${staff.id}/link-user`}>
                    <Button>Link User Account</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium">{value || '-'}</span>
    </div>
  )
}

ShowStaffPage.layout = (page: ReactElement) => <DashboardLayout>{page}</DashboardLayout>

import { ReactElement } from 'react'
import { Head, Link, useForm } from '@inertiajs/react'
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

import type { Department, Designation } from '~/types/staff'

export default function CreateStaffPage({
  departments,
  designations,
}: {
  departments: Department[]
  designations: Designation[]
}) {
  const { data, setData, post, errors, processing } = useForm({
    departmentId: '',
    designationId: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    bloodGroup: '',
    maritalStatus: '',
    nationality: '',
    nationalId: '',
    email: '',
    phone: '',
    alternatePhone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelation: '',
    joiningDate: '',
    employmentType: 'permanent',
    basicSalary: 0,
    bankName: '',
    bankAccountNumber: '',
    status: 'active',
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    post('/staff/members')
  }

  const filteredDesignations = data.departmentId
    ? designations.filter((d) => d.departmentId === data.departmentId)
    : designations

  return (
    <>
      <Head title="Add Staff Member" />

      <div className="max-w-5xl">
        <div className="mb-6">
          <Link href="/staff/members" className="text-blue-600 hover:underline">
            &larr; Back to Staff Members
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Add Staff Member</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information */}
              <div className="space-y-4 rounded-lg border p-5">
                <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField label="First Name" required error={errors.firstName}>
                    <Input
                      id="firstName"
                      value={data.firstName}
                      onChange={(e) => setData('firstName', e.target.value)}
                      className="border border-gray-300"
                    />
                  </FormField>

                  <FormField label="Last Name" error={errors.lastName}>
                    <Input
                      id="lastName"
                      value={data.lastName}
                      onChange={(e) => setData('lastName', e.target.value)}
                      className="border border-gray-300"
                    />
                  </FormField>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField label="Date of Birth" error={errors.dateOfBirth}>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={data.dateOfBirth}
                      onChange={(e) => setData('dateOfBirth', e.target.value)}
                      className="border border-gray-300"
                    />
                  </FormField>

                  <FormField label="Gender" error={errors.gender}>
                    <Select value={data.gender || undefined} onValueChange={(value) => setData('gender', value)}>
                      <SelectTrigger id="gender" className="w-full">
                        <SelectValue placeholder="Select Gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormField>

                  <FormField label="Blood Group" error={errors.bloodGroup}>
                    <Select value={data.bloodGroup || undefined} onValueChange={(value) => setData('bloodGroup', value)}>
                      <SelectTrigger id="bloodGroup" className="w-full">
                        <SelectValue placeholder="Select Blood Group" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A+">A+</SelectItem>
                        <SelectItem value="A-">A-</SelectItem>
                        <SelectItem value="B+">B+</SelectItem>
                        <SelectItem value="B-">B-</SelectItem>
                        <SelectItem value="AB+">AB+</SelectItem>
                        <SelectItem value="AB-">AB-</SelectItem>
                        <SelectItem value="O+">O+</SelectItem>
                        <SelectItem value="O-">O-</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormField>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField label="Marital Status" error={errors.maritalStatus}>
                    <Select
                      value={data.maritalStatus || undefined}
                      onValueChange={(value) => setData('maritalStatus', value)}
                    >
                      <SelectTrigger id="maritalStatus" className="w-full">
                        <SelectValue placeholder="Select Marital Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single">Single</SelectItem>
                        <SelectItem value="married">Married</SelectItem>
                        <SelectItem value="divorced">Divorced</SelectItem>
                        <SelectItem value="widowed">Widowed</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormField>

                  <FormField label="Nationality" error={errors.nationality}>
                    <Input
                      id="nationality"
                      value={data.nationality}
                      onChange={(e) => setData('nationality', e.target.value)}
                      className="border border-gray-300"
                    />
                  </FormField>

                  <FormField label="National ID" error={errors.nationalId}>
                    <Input
                      id="nationalId"
                      value={data.nationalId}
                      onChange={(e) => setData('nationalId', e.target.value)}
                      className="border border-gray-300"
                    />
                  </FormField>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField label="Email" error={errors.email}>
                    <Input
                      id="email"
                      type="email"
                      value={data.email}
                      onChange={(e) => setData('email', e.target.value)}
                      className="border border-gray-300"
                    />
                  </FormField>

                  <FormField label="Phone" error={errors.phone}>
                    <Input
                      id="phone"
                      value={data.phone}
                      onChange={(e) => setData('phone', e.target.value)}
                      className="border border-gray-300"
                    />
                  </FormField>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField label="Alternate Phone" error={errors.alternatePhone}>
                    <Input
                      id="alternatePhone"
                      value={data.alternatePhone}
                      onChange={(e) => setData('alternatePhone', e.target.value)}
                      className="border border-gray-300"
                    />
                  </FormField>

                  <FormField label="Address" error={errors.address}>
                    <Input
                      id="address"
                      value={data.address}
                      onChange={(e) => setData('address', e.target.value)}
                      className="border border-gray-300"
                    />
                  </FormField>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <FormField label="City" error={errors.city}>
                    <Input
                      id="city"
                      value={data.city}
                      onChange={(e) => setData('city', e.target.value)}
                      className="border border-gray-300"
                    />
                  </FormField>

                  <FormField label="State" error={errors.state}>
                    <Input
                      id="state"
                      value={data.state}
                      onChange={(e) => setData('state', e.target.value)}
                      className="border border-gray-300"
                    />
                  </FormField>

                  <FormField label="Postal Code" error={errors.postalCode}>
                    <Input
                      id="postalCode"
                      value={data.postalCode}
                      onChange={(e) => setData('postalCode', e.target.value)}
                      className="border border-gray-300"
                    />
                  </FormField>

                  <FormField label="Country" error={errors.country}>
                    <Input
                      id="country"
                      value={data.country}
                      onChange={(e) => setData('country', e.target.value)}
                      className="border border-gray-300"
                    />
                  </FormField>
                </div>
              </div>

              {/* Employment Information */}
              <div className="space-y-4 rounded-lg border p-5">
                <h3 className="text-lg font-medium text-gray-900">Employment Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField label="Department" error={errors.departmentId}>
                    <Select
                      value={data.departmentId || (departments.length === 0 ? 'none' : undefined)}
                      onValueChange={(value) => {
                        setData('departmentId', value === 'none' ? '' : value)
                        setData('designationId', '')
                      }}
                    >
                      <SelectTrigger id="departmentId" className="w-full">
                        <SelectValue placeholder="Select Department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.length === 0 ? (
                          <SelectItem value="none">Not available</SelectItem>
                        ) : (
                          departments.map((dept) => (
                            <SelectItem key={dept.id} value={dept.id}>
                              {dept.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </FormField>

                  <FormField label="Designation" error={errors.designationId}>
                    <Select
                      value={
                        data.designationId ||
                        (filteredDesignations.length === 0 ? 'none' : undefined)
                      }
                      onValueChange={(value) =>
                        setData('designationId', value === 'none' ? '' : value)
                      }
                    >
                      <SelectTrigger id="designationId" className="w-full">
                        <SelectValue placeholder="Select Designation" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredDesignations.length === 0 ? (
                          <SelectItem value="none">Not available</SelectItem>
                        ) : (
                          filteredDesignations.map((desig) => (
                            <SelectItem key={desig.id} value={desig.id}>
                              {desig.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </FormField>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField label="Employment Type" required error={errors.employmentType}>
                    <Select
                      value={data.employmentType}
                      onValueChange={(value) => setData('employmentType', value)}
                    >
                      <SelectTrigger id="employmentType" className="w-full">
                        <SelectValue placeholder="Select Employment Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="permanent">Permanent</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                        <SelectItem value="temporary">Temporary</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormField>

                  <FormField label="Status" required error={errors.status}>
                    <Select value={data.status} onValueChange={(value) => setData('status', value)}>
                      <SelectTrigger id="status" className="w-full">
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="on_leave">On Leave</SelectItem>
                        <SelectItem value="terminated">Terminated</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormField>
                </div>

                <FormField label="Basic Salary" required error={errors.basicSalary}>
                  <Input
                    id="basicSalary"
                    type="number"
                    value={data.basicSalary}
                    onChange={(e) => setData('basicSalary', parseInt(e.target.value) || 0)}
                    className="border border-gray-300"
                  />
                </FormField>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField label="Joining Date" error={errors.joiningDate}>
                    <Input
                      id="joiningDate"
                      type="date"
                      value={data.joiningDate}
                      onChange={(e) => setData('joiningDate', e.target.value)}
                      className="border border-gray-300"
                    />
                  </FormField>

                  <FormField label="Bank Name" error={errors.bankName}>
                    <Input
                      id="bankName"
                      value={data.bankName}
                      onChange={(e) => setData('bankName', e.target.value)}
                      className="border border-gray-300"
                    />
                  </FormField>

                  <FormField label="Bank Account Number" error={errors.bankAccountNumber}>
                    <Input
                      id="bankAccountNumber"
                      value={data.bankAccountNumber}
                      onChange={(e) => setData('bankAccountNumber', e.target.value)}
                      className="border border-gray-300"
                    />
                  </FormField>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="space-y-4 rounded-lg border p-5">
                <h3 className="text-lg font-medium text-gray-900">Emergency Contact</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField label="Name" error={errors.emergencyContactName}>
                    <Input
                      id="emergencyContactName"
                      value={data.emergencyContactName}
                      onChange={(e) => setData('emergencyContactName', e.target.value)}
                      className="border border-gray-300"
                    />
                  </FormField>

                  <FormField label="Phone" error={errors.emergencyContactPhone}>
                    <Input
                      id="emergencyContactPhone"
                      value={data.emergencyContactPhone}
                      onChange={(e) => setData('emergencyContactPhone', e.target.value)}
                      className="border border-gray-300"
                    />
                  </FormField>

                  <FormField label="Relation" error={errors.emergencyContactRelation}>
                    <Input
                      id="emergencyContactRelation"
                      value={data.emergencyContactRelation}
                      onChange={(e) => setData('emergencyContactRelation', e.target.value)}
                      className="border border-gray-300"
                    />
                  </FormField>
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={processing}>
                  {processing ? 'Creating...' : 'Add Staff Member'}
                </Button>
                <Link href="/staff/members">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

CreateStaffPage.layout = (page: ReactElement) => <DashboardLayout>{page}</DashboardLayout>

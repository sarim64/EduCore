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

import type { Student } from '~/types/students'

export default function EditStudentPage({ student }: { student: Student }) {
  const { data, setData, put, errors, processing } = useForm({
    firstName: student.firstName,
    lastName: student.lastName || '',
    dateOfBirth: student.dateOfBirth || '',
    admissionDate: student.admissionDate || '',
    gender: student.gender || '',
    bloodGroup: student.bloodGroup || '',
    religion: student.religion || '',
    nationality: student.nationality || '',
    email: student.email || '',
    phone: student.phone || '',
    address: student.address || '',
    city: student.city || '',
    state: student.state || '',
    postalCode: student.postalCode || '',
    country: student.country || '',
    previousSchool: student.previousSchool || '',
    emergencyContactName: student.emergencyContactName || '',
    emergencyContactPhone: student.emergencyContactPhone || '',
    medicalConditions: student.medicalConditions || '',
    allergies: student.allergies || '',
    status: student.status,
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    put(`/students/${student.id}`)
  }

  return (
    <>
      <Head title={`Edit ${student.firstName}`} />

      <div className="max-w-4xl">
        <div className="mb-6">
          <Link href="/students" className="text-blue-600 hover:underline">
            &larr; Back to Students
          </Link>
          <h1 className="text-2xl font-bold mt-2">
            Edit: {student.firstName} {student.lastName}
          </h1>
          <p className="text-gray-500">Student ID: {student.studentId}</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Personal Information */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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

              <div className="grid grid-cols-3 gap-4">
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
                  <Select
                    value={data.gender || undefined}
                    onValueChange={(value) => setData('gender', value)}
                  >
                    <SelectTrigger id="gender" className="w-full">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>

                <FormField label="Blood Group" error={errors.bloodGroup}>
                  <Select
                    value={data.bloodGroup || undefined}
                    onValueChange={(value) => setData('bloodGroup', value)}
                  >
                    <SelectTrigger id="bloodGroup" className="w-full">
                      <SelectValue placeholder="Select" />
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

              <div className="grid grid-cols-2 gap-4">
                <FormField label="Religion" error={errors.religion}>
                  <Input
                    id="religion"
                    value={data.religion}
                    onChange={(e) => setData('religion', e.target.value)}
                    className="border border-gray-300"
                  />
                </FormField>

                <FormField label="Nationality" error={errors.nationality}>
                  <Input
                    id="nationality"
                    value={data.nationality}
                    onChange={(e) => setData('nationality', e.target.value)}
                    className="border border-gray-300"
                  />
                </FormField>
              </div>

              <FormField label="Status" error={errors.status}>
                <Select value={data.status} onValueChange={(value) => setData('status', value)}>
                  <SelectTrigger id="status" className="w-full">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="graduated">Graduated</SelectItem>
                    <SelectItem value="transferred">Transferred</SelectItem>
                    <SelectItem value="expelled">Expelled</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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

              <FormField label="Address" error={errors.address}>
                <Input
                  id="address"
                  value={data.address}
                  onChange={(e) => setData('address', e.target.value)}
                  className="border border-gray-300"
                />
              </FormField>

              <div className="grid grid-cols-4 gap-4">
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
            </CardContent>
          </Card>

          {/* Emergency & Medical */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Emergency & Medical Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Admission Date" error={errors.admissionDate}>
                  <Input
                    id="admissionDate"
                    type="date"
                    value={data.admissionDate}
                    onChange={(e) => setData('admissionDate', e.target.value)}
                    className="border border-gray-300"
                  />
                </FormField>

                <FormField label="Previous School" error={errors.previousSchool}>
                  <Input
                    id="previousSchool"
                    value={data.previousSchool}
                    onChange={(e) => setData('previousSchool', e.target.value)}
                    className="border border-gray-300"
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="Emergency Contact Name" error={errors.emergencyContactName}>
                  <Input
                    id="emergencyContactName"
                    value={data.emergencyContactName}
                    onChange={(e) => setData('emergencyContactName', e.target.value)}
                    className="border border-gray-300"
                  />
                </FormField>

                <FormField label="Emergency Contact Phone" error={errors.emergencyContactPhone}>
                  <Input
                    id="emergencyContactPhone"
                    value={data.emergencyContactPhone}
                    onChange={(e) => setData('emergencyContactPhone', e.target.value)}
                    className="border border-gray-300"
                  />
                </FormField>
              </div>
              <FormField label="Medical Conditions" error={errors.medicalConditions}>
                <Input
                  id="medicalConditions"
                  value={data.medicalConditions}
                  onChange={(e) => setData('medicalConditions', e.target.value)}
                  className="border border-gray-300"
                />
              </FormField>

              <FormField label="Allergies" error={errors.allergies}>
                <Input
                  id="allergies"
                  value={data.allergies}
                  onChange={(e) => setData('allergies', e.target.value)}
                  className="border border-gray-300"
                />
              </FormField>
            </CardContent>
          </Card>

          <div className="flex gap-2">
            <Button type="submit" disabled={processing}>
              {processing ? 'Saving...' : 'Save Changes'}
            </Button>
            <Link href="/students">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </>
  )
}

EditStudentPage.layout = (page: ReactElement) => <DashboardLayout>{page}</DashboardLayout>

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

import type { Guardian } from '~/types/students'

export default function EditGuardianPage({ guardian }: { guardian: Guardian }) {
  const { data, setData, put, errors, processing } = useForm({
    firstName: guardian.firstName,
    lastName: guardian.lastName || '',
    relation: guardian.relation,
    phone: guardian.phone,
    email: guardian.email || '',
    alternatePhone: guardian.alternatePhone || '',
    address: guardian.address || '',
    city: guardian.city || '',
    state: guardian.state || '',
    postalCode: guardian.postalCode || '',
    country: guardian.country || '',
    occupation: guardian.occupation || '',
    workplace: guardian.workplace || '',
    nationalId: guardian.nationalId || '',
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    put(`/guardians/${guardian.id}`)
  }

  return (
    <>
      <Head title={`Edit ${guardian.firstName}`} />

      <div className="max-w-3xl">
        <div className="mb-6">
          <Link href="/guardians" className="text-blue-600 hover:underline">
            &larr; Back to Guardians
          </Link>
          <h1 className="text-2xl font-bold mt-2">
            Edit: {guardian.firstName} {guardian.lastName}
          </h1>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Guardian Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
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

                <FormField label="Relation" required error={errors.relation}>
                  <Select
                    value={data.relation}
                    onValueChange={(value) => setData('relation', value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="father">Father</SelectItem>
                      <SelectItem value="mother">Mother</SelectItem>
                      <SelectItem value="guardian">Guardian</SelectItem>
                      <SelectItem value="uncle">Uncle</SelectItem>
                      <SelectItem value="aunt">Aunt</SelectItem>
                      <SelectItem value="grandparent">Grandparent</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <FormField label="Phone" required error={errors.phone}>
                  <Input
                    id="phone"
                    value={data.phone}
                    onChange={(e) => setData('phone', e.target.value)}
                    className="border border-gray-300"
                  />
                </FormField>

                <FormField label="Alternate Phone" error={errors.alternatePhone}>
                  <Input
                    id="alternatePhone"
                    value={data.alternatePhone}
                    onChange={(e) => setData('alternatePhone', e.target.value)}
                    className="border border-gray-300"
                  />
                </FormField>

                <FormField label="Email" error={errors.email}>
                  <Input
                    id="email"
                    type="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
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

              <div className="grid grid-cols-3 gap-4">
                <FormField label="Occupation" error={errors.occupation}>
                  <Input
                    id="occupation"
                    value={data.occupation}
                    onChange={(e) => setData('occupation', e.target.value)}
                    className="border border-gray-300"
                  />
                </FormField>

                <FormField label="Workplace" error={errors.workplace}>
                  <Input
                    id="workplace"
                    value={data.workplace}
                    onChange={(e) => setData('workplace', e.target.value)}
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
            </CardContent>
          </Card>

          <div className="flex gap-2">
            <Button type="submit" disabled={processing}>
              {processing ? 'Saving...' : 'Save Changes'}
            </Button>
            <Link href="/guardians">
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

EditGuardianPage.layout = (page: ReactElement) => <DashboardLayout>{page}</DashboardLayout>

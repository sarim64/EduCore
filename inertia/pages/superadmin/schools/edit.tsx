import { type ReactElement } from 'react'
import { Head, Link, useForm } from '@inertiajs/react'
import AdminLayout from '~/layouts/AdminLayout'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import type { School } from '~/types'

export default function AdminSchoolsEditPage({ school }: { school: School }) {
  const { data, setData, put, errors, processing } = useForm({
    name: school.name,
    code: school.code || '',
    address: school.address || '',
    phone: school.phone || '',
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    put(`/admin/schools/${school.id}`)
  }

  return (
    <>
      <Head title={`Edit ${school.name}`} />

      {/* Centered container with padding */}
      <div className="max-w-3xl mx-auto py-10 space-y-8 px-4">
        <div>
          <Link
            href="/admin/schools"
            className="text-[color:var(--primary)] hover:text-[color:var(--primary-foreground-link)] text-sm"
          >
            ← Back to Schools
          </Link>
          <h1 className="text-4xl font-bold text-[color:var(--foreground)] mt-2">Edit School</h1>
          <p className="text-[color:var(--muted-foreground)] mt-1">Update school information</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* School Information */}
          <Card className="bg-[color:var(--card)] border-[color:var(--border)] shadow-md">
            <CardHeader>
              <CardTitle className="text-[color:var(--card-foreground)]">
                School Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[color:var(--foreground)]">
                  School Name *
                </Label>
                <Input
                  id="name"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  placeholder="Enter school name"
                />
                {errors.name && (
                  <p className="text-[color:var(--destructive)] text-sm">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="code" className="text-[color:var(--foreground)]">
                  School Code
                </Label>
                <Input
                  id="code"
                  value={data.code}
                  onChange={(e) => setData('code', e.target.value)}
                  placeholder="e.g., SCH001"
                />
                {errors.code && (
                  <p className="text-[color:var(--destructive)] text-sm">{errors.code}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-[color:var(--foreground)]">
                  Address
                </Label>
                <Textarea
                  id="address"
                  value={data.address}
                  onChange={(e) => setData('address', e.target.value)}
                  placeholder="Enter school address"
                />
                {errors.address && (
                  <p className="text-[color:var(--destructive)] text-sm">{errors.address}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-[color:var(--foreground)]">
                  Phone
                </Label>
                <Input
                  id="phone"
                  value={data.phone}
                  onChange={(e) => setData('phone', e.target.value)}
                  placeholder="Enter phone number"
                />
                {errors.phone && (
                  <p className="text-[color:var(--destructive)] text-sm">{errors.phone}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button type="submit" disabled={processing}>
              {processing ? 'Saving...' : 'Save Changes'}
            </Button>
            <Link href="/admin/schools">
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

AdminSchoolsEditPage.layout = (page: ReactElement) => <AdminLayout>{page}</AdminLayout>

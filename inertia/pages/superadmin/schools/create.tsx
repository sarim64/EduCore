import { type ReactElement } from 'react'
import { Head, Link, useForm } from '@inertiajs/react'
import AdminLayout from '~/layouts/AdminLayout'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'

export default function AdminSchoolsCreatePage() {
  const { data, setData, post, errors, processing } = useForm({
    name: '',
    code: '',
    address: '',
    phone: '',
    adminEmail: '',
    adminFirstName: '',
    adminLastName: '',
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    post('/admin/schools')
  }

  return (
    <>
      <Head title="Create School" />

      {/* Centered container with padding */}
      <div className="max-w-3xl mx-auto py-10 space-y-8 px-4">
        <div>
          <Link
            href="/admin/schools"
            className="text-[color:var(--primary)] hover:text-[color:var(--primary-foreground-link)] text-sm"
          >
            ← Back to Schools
          </Link>
          <h1 className="text-4xl font-bold text-[color:var(--foreground)] mt-2">Create School</h1>
          <p className="text-[color:var(--muted-foreground)] mt-1">
            Add a new school to the system
          </p>
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

          {/* Initial Admin */}
          <Card className="bg-[color:var(--card)] border-[color:var(--border)] shadow-md">
            <CardHeader>
              <CardTitle className="text-[color:var(--card-foreground)]">
                Initial Admin (Optional)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-[color:var(--muted-foreground)] text-sm">
                Optionally create an initial school admin user. If the email already exists, the
                existing user will be added as admin.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="adminFirstName" className="text-[color:var(--foreground)]">
                    First Name
                  </Label>
                  <Input
                    id="adminFirstName"
                    value={data.adminFirstName}
                    onChange={(e) => setData('adminFirstName', e.target.value)}
                    placeholder="First name"
                  />
                  {errors.adminFirstName && (
                    <p className="text-[color:var(--destructive)] text-sm">
                      {errors.adminFirstName}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="adminLastName" className="text-[color:var(--foreground)]">
                    Last Name
                  </Label>
                  <Input
                    id="adminLastName"
                    value={data.adminLastName}
                    onChange={(e) => setData('adminLastName', e.target.value)}
                    placeholder="Last name"
                  />
                  {errors.adminLastName && (
                    <p className="text-[color:var(--destructive)] text-sm">
                      {errors.adminLastName}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="adminEmail" className="text-[color:var(--foreground)]">
                  Email
                </Label>
                <Input
                  id="adminEmail"
                  type="email"
                  value={data.adminEmail}
                  onChange={(e) => setData('adminEmail', e.target.value)}
                  placeholder="admin@school.com"
                />
                {errors.adminEmail && (
                  <p className="text-[color:var(--destructive)] text-sm">{errors.adminEmail}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button type="submit" disabled={processing}>
              {processing ? 'Creating...' : 'Create School'}
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

AdminSchoolsCreatePage.layout = (page: ReactElement) => <AdminLayout>{page}</AdminLayout>

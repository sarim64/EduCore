import { type ReactElement } from 'react'
import { Head, Link, useForm } from '@inertiajs/react'
import AdminLayout from '~/layouts/AdminLayout'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import type { School } from '~/types'

export default function AdminSchoolAdminsCreatePage({ school }: { school: School }) {
  const { data, setData, post, errors, processing } = useForm({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    post(`/admin/schools/${school.id}/admins`)
  }

  return (
    <>
      <Head title={`Add Admin - ${school.name}`} />

      <div className="max-w-3xl mx-auto py-10 px-4 space-y-8">
        <div>
          <Link
            href={`/admin/schools/${school.id}/admins`}
            className="text-[color:var(--primary)] hover:text-[color:var(--primary-foreground-link)] text-sm"
          >
            ← Back to Admins
          </Link>
          <h1 className="text-4xl font-bold text-[color:var(--foreground)] mt-2">
            Add School Admin
          </h1>
          <p className="text-[color:var(--muted-foreground)] mt-1">
            Add an administrator to {school.name}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="bg-[color:var(--card)] border-[color:var(--border)] shadow-md">
            <CardHeader>
              <CardTitle className="text-[color:var(--card-foreground)]">
                Admin Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-[color:var(--muted-foreground)] text-sm">
                If the email already exists in the system, the existing user will be added as an
                admin. Otherwise, a new user will be created.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-[color:var(--foreground)]">
                    First Name *
                  </Label>
                  <Input
                    id="firstName"
                    value={data.firstName}
                    onChange={(e) => setData('firstName', e.target.value)}
                    placeholder="First name"
                  />
                  {errors.firstName && (
                    <p className="text-[color:var(--destructive)] text-sm">{errors.firstName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-[color:var(--foreground)]">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    value={data.lastName}
                    onChange={(e) => setData('lastName', e.target.value)}
                    placeholder="Last name"
                  />
                  {errors.lastName && (
                    <p className="text-[color:var(--destructive)] text-sm">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-[color:var(--foreground)]">
                  Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={data.email}
                  onChange={(e) => setData('email', e.target.value)}
                  placeholder="admin@school.com"
                />
                {errors.email && (
                  <p className="text-[color:var(--destructive)] text-sm">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-[color:var(--foreground)]">
                  Password (for new users)
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={data.password}
                  onChange={(e) => setData('password', e.target.value)}
                  placeholder="Leave blank for default password"
                />
                <p className="text-[color:var(--muted-foreground)] text-xs">
                  If left blank, a default password will be set for new users.
                </p>
                {errors.password && (
                  <p className="text-[color:var(--destructive)] text-sm">{errors.password}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button type="submit" disabled={processing}>
              {processing ? 'Adding...' : 'Add Admin'}
            </Button>
            <Link href={`/admin/schools/${school.id}/admins`}>
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

AdminSchoolAdminsCreatePage.layout = (page: ReactElement) => <AdminLayout>{page}</AdminLayout>

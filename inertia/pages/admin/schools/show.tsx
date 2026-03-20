import { type ReactElement } from 'react'
import { Head, Link } from '@inertiajs/react'
import AdminLayout from '~/layouts/AdminLayout'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import type { School } from '~/types'

export default function AdminSchoolsShowPage({ school }: { school: School }) {
  return (
    <>
      <Head title={school.name} />

      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <Link
              href="/admin/schools"
              className="text-[color:var(--primary)] hover:text-[color:var(--primary-foreground-link)] text-sm"
            >
              ← Back to Schools
            </Link>
            <h1 className="text-3xl font-bold mt-2">{school.name}</h1>
            {school.code && (
              <p className="mt-1 text-[color:var(--muted-foreground)]">Code: {school.code}</p>
            )}
          </div>

          <div className="flex gap-2">
            <Link href={`/admin/schools/${school.id}/edit`}>
              <Button variant="outline">Edit School</Button>
            </Link>
            <Link href={`/admin/schools/${school.id}/subscription`}>
              <Button>Subscription</Button>
            </Link>
            <Link href={`/admin/schools/${school.id}/admins`}>
              <Button>Manage Admins</Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>School Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-[color:var(--muted-foreground)]">Address</p>
                <p>{school.address || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-sm text-[color:var(--muted-foreground)]">Phone</p>
                <p>{school.phone || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-sm text-[color:var(--muted-foreground)]">Created</p>
                <p>{new Date(school.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-[color:var(--muted-foreground)]">Last Updated</p>
                <p>{school.updatedAt ? new Date(school.updatedAt).toLocaleString() : '-'}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex items-center justify-between">
              <CardTitle>School Admins</CardTitle>
              <Link href={`/admin/schools/${school.id}/admins`}>
                <Button variant="ghost" size="sm" className="text-[color:var(--primary)]">
                  Manage
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {school.users && school.users.length > 0 ? (
                <ul className="space-y-3">
                  {school.users.map((user) => (
                    <li key={user.id} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm">
                        {user.firstName[0]}
                        {user.lastName?.[0] || ''}
                      </div>
                      <div>
                        <p>
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-sm text-[color:var(--muted-foreground)]">{user.email}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[color:var(--muted-foreground)]">No admins assigned yet.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}

AdminSchoolsShowPage.layout = (page: ReactElement) => <AdminLayout>{page}</AdminLayout>

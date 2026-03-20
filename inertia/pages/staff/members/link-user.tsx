import { ReactElement, useState } from 'react'
import { Head, Link, useForm } from '@inertiajs/react'
import DashboardLayout from '~/layouts/DashboardLayout'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '~/components/ui/select'
import type { StaffMember, LinkedUser } from '~/types/staff'

const ROLES = [
  { id: 2, name: 'School Admin' },
  { id: 3, name: 'Principal' },
  { id: 4, name: 'Teacher' },
  { id: 5, name: 'Accountant' },
  { id: 6, name: 'Support Staff' },
]

export default function LinkUserPage({
  staff,
  matchedEmailUser,
  users,
}: {
  staff: StaffMember
  matchedEmailUser: (LinkedUser & { isInCurrentSchool: boolean }) | null
  users: LinkedUser[]
}) {
  const defaultAction: 'create' | 'link' = matchedEmailUser ? 'create' : 'link'
  const [mode, setMode] = useState<'create' | 'link'>('link')
  const { data, setData, post, errors, processing } = useForm({
    action: defaultAction,
    userId: '',
    password: '',
    roleId: 4,
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    post(`/staff/members/${staff.id}/link-user`)
  }

  function linkMatchedEmailUser() {
    post(`/staff/members/${staff.id}/link-user`)
  }

  const showMatchedOutOfSchoolFlow = !!matchedEmailUser && !matchedEmailUser.isInCurrentSchool
  const showMatchedInSchoolFlow = !!matchedEmailUser && matchedEmailUser.isInCurrentSchool

  return (
    <>
      <Head title={`Link User Account - ${staff.fullName}`} />

      <div className="max-w-2xl">
        <div className="mb-6">
          <Link href={`/staff/members/${staff.id}`} className="text-blue-600 hover:underline">
            &larr; Back to {staff.fullName}
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Link User Account</CardTitle>
            <p className="text-sm text-gray-600">
              {staff.fullName} ({staff.staffMemberId})
            </p>
          </CardHeader>
          <CardContent>
            {showMatchedOutOfSchoolFlow && (
              <div className="space-y-4">
                <div className="rounded border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
                  <p className="font-medium">User already exists globally</p>
                  <p className="mt-1">
                    {matchedEmailUser.fullName} ({matchedEmailUser.email}) exists but is not yet in
                    this school. Link to this staff member and choose role for this school.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="roleId">Role *</Label>
                  <Select
                    value={String(data.roleId)}
                    onValueChange={(value) => setData('roleId', parseInt(value))}
                  >
                    <SelectTrigger id="roleId" className="w-full">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLES.map((role) => (
                        <SelectItem key={role.id} value={String(role.id)}>
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.roleId && <p className="text-sm text-red-500">{errors.roleId}</p>}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button type="button" disabled={processing} onClick={linkMatchedEmailUser}>
                    {processing ? 'Linking...' : 'Link Matched User'}
                  </Button>
                  <Link href={`/staff/members/${staff.id}`}>
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {showMatchedInSchoolFlow && (
              <div className="space-y-4">
                <div className="rounded border border-green-200 bg-green-50 p-4 text-sm text-green-900">
                  <p className="font-medium">User already exists in this school</p>
                  <p className="mt-1">
                    {matchedEmailUser.fullName} ({matchedEmailUser.email}) matches this staff
                    member's email.
                  </p>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button type="button" disabled={processing} onClick={linkMatchedEmailUser}>
                    {processing ? 'Linking...' : 'Link Matched User'}
                  </Button>
                  <Link href={`/staff/members/${staff.id}`}>
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {!matchedEmailUser && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-3">
                  <Button
                  type="button"
                  variant={mode === 'create' ? 'default' : 'outline'}
                  onClick={() => {
                    setMode('create')
                    setData('action', 'create')
                  }}
                  className="flex-1"
                >
                  Create Account
                </Button>
                <Button
                  type="button"
                  variant={mode === 'link' ? 'default' : 'outline'}
                  onClick={() => {
                    setMode('link')
                    setData('action', 'link')
                  }}
                  className="flex-1"
                >
                  Link Existing User
                </Button>
              </div>

              {mode === 'create' ? (
                <>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input value={staff.email ?? ''} disabled className="border border-gray-300" />
                    {!staff.email && (
                      <p className="text-sm text-red-500">
                        Staff member must have an email to create user account.
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password"
                      type="password"
                      value={data.password}
                      onChange={(e) => setData('password', e.target.value)}
                      className="border border-gray-300"
                      disabled={!staff.email}
                    />
                    {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="roleId">Role *</Label>
                    <Select
                      value={String(data.roleId)}
                      onValueChange={(value) => setData('roleId', parseInt(value))}
                    >
                      <SelectTrigger id="roleId" className="w-full">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        {ROLES.map((role) => (
                          <SelectItem key={role.id} value={String(role.id)}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.roleId && <p className="text-sm text-red-500">{errors.roleId}</p>}
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="userId">Select User *</Label>
                  <Select
                    value={data.userId || 'none'}
                    onValueChange={(value) => setData('userId', value === 'none' ? '' : value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a user..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Select a user...</SelectItem>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.fullName} ({user.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.userId && <p className="text-sm text-red-500">{errors.userId}</p>}
                  {users.length === 0 && (
                    <p className="text-sm text-gray-500">
                      No eligible users found in this school to link.
                    </p>
                  )}
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button
                  type="submit"
                  disabled={processing || (mode === 'link' ? !data.userId : !staff.email)}
                >
                  {processing ? 'Saving...' : mode === 'create' ? 'Create & Link Account' : 'Link User Account'}
                </Button>
                <Link href={`/staff/members/${staff.id}`}>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}

LinkUserPage.layout = (page: ReactElement) => <DashboardLayout>{page}</DashboardLayout>

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
import type { InvitableRole } from '~/types/invites'

type Props = {
  invitableRoles: InvitableRole[]
}

export default function CreateInvitePage({ invitableRoles }: Props) {
  const { data, setData, post, errors, processing } = useForm({
    email: '',
    roleId: '',
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    post('/invites')
  }

  return (
    <>
      <Head title="Send Invitation" />

      <div className="max-w-2xl">
        <div className="mb-6">
          <Link href="/invites" className="text-blue-600 hover:underline">
            &larr; Back to Invitations
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Send Invitation</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormField label="Email Address" required error={errors.email}>
                <Input
                  name="email"
                  type="email"
                  placeholder="colleague@example.com"
                  value={data.email}
                  onChange={(e) => setData('email', e.target.value)}
                  className="border border-gray-300"
                />
              </FormField>

              <FormField label="Role" required error={errors.roleId}>
                <Select
                  value={String(data.roleId)}
                  onValueChange={(value) => setData('roleId', value)}
                >
                  <SelectTrigger className="border border-gray-300">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {invitableRoles.map((role) => (
                      <SelectItem key={role.id} value={String(role.id)}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              <div className="flex gap-2">
                <Button type="submit" disabled={processing}>
                  {processing ? 'Sending...' : 'Send Invitation'}
                </Button>
                <Link href="/invites">
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

CreateInvitePage.layout = (page: ReactElement) => <DashboardLayout>{page}</DashboardLayout>

import { ReactElement } from 'react'
import { Head, Link, useForm } from '@inertiajs/react'
import DashboardLayout from '~/layouts/DashboardLayout'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import type { SchoolInvite, InviteStatus } from '~/types/invites'

type Props = {
  invites: SchoolInvite[]
}

const STATUS_BADGE: Record<InviteStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  pending: { label: 'Pending', variant: 'default' },
  accepted: { label: 'Accepted', variant: 'secondary' },
  cancelled: { label: 'Cancelled', variant: 'outline' },
  expired: { label: 'Expired', variant: 'destructive' },
}

export default function InvitesIndexPage({ invites }: Props) {
  const { delete: destroy, processing } = useForm()

  function handleCancel(id: string) {
    if (confirm('Are you sure you want to cancel this invitation?')) {
      destroy(`/invites/${id}`)
    }
  }

  return (
    <>
      <Head title="Invitations" />

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Invitations</h1>
          <Link href="/invites/create">
            <Button>Invite Someone</Button>
          </Link>
        </div>

        <div className="grid gap-4">
          {invites.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-gray-500">
                No invitations sent yet.
              </CardContent>
            </Card>
          ) : (
            invites.map((invite) => {
              const badge = STATUS_BADGE[invite.status]
              return (
                <Card key={invite.id}>
                  <CardHeader className="flex flex-row items-center justify-between py-4">
                    <div className="space-y-1">
                      <CardTitle className="text-base flex items-center gap-2">
                        {invite.email}
                        <Badge variant={badge.variant}>{badge.label}</Badge>
                      </CardTitle>
                      <p className="text-sm text-gray-500">
                        Role: {invite.roleName}
                        {invite.invitedByUser && ` · Invited by ${invite.invitedByUser.fullName}`}
                        {invite.expiresAt &&
                          invite.status === 'pending' &&
                          ` · Expires ${new Date(invite.expiresAt).toLocaleDateString()}`}
                      </p>
                    </div>
                    {invite.status === 'pending' && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleCancel(invite.id)}
                        disabled={processing}
                      >
                        Cancel
                      </Button>
                    )}
                  </CardHeader>
                </Card>
              )
            })
          )}
        </div>
      </div>
    </>
  )
}

InvitesIndexPage.layout = (page: ReactElement) => <DashboardLayout>{page}</DashboardLayout>

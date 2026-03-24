import { ReactElement } from 'react'
import { Head, useForm } from '@inertiajs/react'
import AuthLayout from '~/layouts/AuthLayout'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { FormField } from '~/components/FormField'

type Props = {
  isValid: boolean
  isNewUser: boolean
  token: string
  schoolName: string | null
  roleName: string | null
  email: string | null
}

export default function AcceptInvitePage({
  isValid,
  isNewUser,
  token,
  schoolName,
  roleName,
  email,
}: Props) {
  const { data, setData, post, errors, processing } = useForm({
    token,
    firstName: '',
    lastName: '',
    password: '',
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    post('/auth/invites/accept')
  }

  if (!isValid) {
    return (
      <>
        <Head title="Invalid Invitation" />
        <div className="text-center space-y-3">
          <h2 className="text-xl font-semibold text-gray-900">Invitation Not Found</h2>
          <p className="text-sm text-muted-foreground">
            This invitation link is invalid, expired, or has already been used.
          </p>
          <p className="text-sm text-muted-foreground">
            Please contact your school administrator to request a new invitation.
          </p>
        </div>
      </>
    )
  }

  return (
    <>
      <Head title="Accept Invitation" />
      <div className="text-center space-y-1 mb-2">
        <h2 className="text-xl font-semibold text-gray-900">
          Join {schoolName ?? 'your school'}
        </h2>
        <p className="text-sm text-muted-foreground">
          You've been invited as <strong>{roleName}</strong>
          {email && ` for ${email}`}
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <input type="hidden" name="token" value={data.token} />

        {isNewUser ? (
          <>
            <FormField label="First Name" required error={errors.firstName}>
              <Input
                name="firstName"
                placeholder="Jane"
                value={data.firstName}
                onChange={(e) => setData('firstName', e.target.value)}
                className="border border-gray-300 placeholder:text-gray-500 text-black"
              />
            </FormField>

            <FormField label="Last Name" error={errors.lastName}>
              <Input
                name="lastName"
                placeholder="Doe"
                value={data.lastName}
                onChange={(e) => setData('lastName', e.target.value)}
                className="border border-gray-300 placeholder:text-gray-500 text-black"
              />
            </FormField>

            <FormField label="Password" required error={errors.password}>
              <Input
                name="password"
                type="password"
                placeholder="••••••••"
                value={data.password}
                onChange={(e) => setData('password', e.target.value)}
                className="border border-gray-300 placeholder:text-gray-500 text-black"
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </FormField>

            <Button type="submit" className="w-full" disabled={processing}>
              {processing ? 'Setting up your account...' : 'Create Account & Join'}
            </Button>
          </>
        ) : (
          <Button type="submit" className="w-full" disabled={processing}>
            {processing ? 'Joining...' : `Join ${schoolName ?? 'School'}`}
          </Button>
        )}
      </form>
    </>
  )
}

AcceptInvitePage.layout = (page: ReactElement) => <AuthLayout>{page}</AuthLayout>

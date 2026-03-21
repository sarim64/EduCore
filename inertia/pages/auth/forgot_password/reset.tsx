import { type ReactElement } from 'react'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import { Label } from '~/components/ui/label'
import AuthLayout from '~/layouts/AuthLayout'
import { Link, useForm } from '@inertiajs/react'
import { Head } from '@inertiajs/react'

type Props = {
  value: string
  isValid: boolean
  email?: string
}
export default function ResetPasswordPage({ value, isValid, email }: Props) {
  const { data, setData, post, errors, processing, reset } = useForm({
    value: value,
    password: '',
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    post('/auth/forgot-password/reset', {
      onSuccess: () => {
        reset()
      },
      preserveScroll: true,
    })
  }

  return (
    <>
      <Head title="Reset Password" />
      {!isValid ? (
        <div className="space-y-4 text-center">
          <p className="text-sm text-red-500">Your reset link has expired.</p>
          <Link
            href="/auth/forgot-password"
            className="inline-block text-sm text-blue-600 hover:underline"
          >
            Request a new password reset link
          </Link>
        </div>
      ) : (
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              disabled={true}
              name="email"
              type="email"
              value={email}
              className="border border-gray-300 placeholder:text-gray-500 text-black"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Enter your new password</Label>
            <Input
              name="password"
              type="password"
              value={data.password}
              onChange={(e) => setData('password', e.target.value)}
              className="border border-gray-300 placeholder:text-gray-500 text-black"
            />
            {errors?.password && (
              <p className="text-sm text-red-500">{errors.password}</p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={processing}>
            {processing ? 'Resetting...' : 'Reset Password'}
          </Button>
        </form>
      )}
    </>
  )
}
ResetPasswordPage.layout = (page: ReactElement) => <AuthLayout>{page}</AuthLayout>

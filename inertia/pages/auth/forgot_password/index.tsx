import { type ReactElement, useState } from 'react'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import { Label } from '~/components/ui/label'
import AuthLayout from '~/layouts/AuthLayout'
import { Link, useForm } from '@inertiajs/react'
import { Head } from '@inertiajs/react'
import { cn } from '~/lib/utils'

export default function ForgotPasswordPage() {
  const { data, setData, post, errors, processing } = useForm({
    email: '',
  })

  const [sent, setSent] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    post('forgot-password', {
      onSuccess: () => setSent(true),
    })
  }

  return (
    <>
      <Head title="Reset Password" />
      {sent ? (
        <div className="space-y-4 text-center">
          <p className="text-sm text-green-600">
            If your email is registered, a reset link has been sent.
          </p>
          <Link href="../auth/login" className="inline-block text-sm text-blue-600 hover:underline">
            Back to Sign In
          </Link>
        </div>
      ) : (
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="email">Enter your registered EduCore email</Label>
            <Input
              name="email"
              type="email"
              placeholder="you@example.com"
              aria-errormessage={errors?.email}
              value={data.email}
              onChange={(e) => setData('email', e.target.value)}
              className="border border-gray-300 placeholder:text-gray-500 text-black"
            />
          </div>
          <Button type="submit" className="w-full">
            Reset Password
          </Button>

          <div className="text-center">
            <Link
              href="../auth/login"
              className={cn(
                'inline-block text-sm text-blue-600 hover:underline',
                processing && 'pointer-events-none opacity-50'
              )}
            >
              Back to Sign In
            </Link>
          </div>
        </form>
      )}
    </>
  )
}
ForgotPasswordPage.layout = (page: ReactElement) => <AuthLayout>{page}</AuthLayout>

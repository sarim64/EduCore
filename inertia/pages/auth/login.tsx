import { ReactElement } from 'react'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import AuthLayout from '~/layouts/AuthLayout'
import { Link, useForm } from '@inertiajs/react'
import { cn } from '~/lib/utils'
import { Head } from '@inertiajs/react'
import { FormField } from '~/components/FormField'

export default function LoginPage() {
  const { data, setData, post, errors, processing } = useForm({
    email: '',
    password: '',
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    post('login')
  }

  return (
    <>
      <Head title="EduCore - Login" />
      <div className="text-center">
        <p className="text-sm text-muted-foreground">Login to your EduCore account</p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <FormField label="Email Address" required error={errors?.email} className="relative">
          <Input
            name="email"
            type="email"
            placeholder="you@example.com"
            aria-errormessage={errors?.email}
            value={data.email}
            onChange={(e) => setData('email', e.target.value)}
            className="border border-gray-300 placeholder:text-gray-500 text-black"
          />
        </FormField>

        <FormField label="Password" required error={errors?.password} className="relative">
          <Input
            name="password"
            type="password"
            placeholder="••••••••"
            aria-errormessage={errors?.password}
            value={data.password}
            onChange={(e) => setData('password', e.target.value)}
            className="border border-gray-300 placeholder:text-gray-500 text-black"
          />
        </FormField>

        <div className="text-right text-sm">
          <Link
            href="/auth/forgot-password"
            className={cn(
              'text-blue-600 hover:underline',
              processing && 'pointer-events-none opacity-50'
            )}
          >
            Forgot password?
          </Link>
        </div>

        <Button type="submit" className="w-full">
          Sign In
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-sm text-muted-foreground">
            <span className="bg-white px-2">or</span>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{' '}
          <Link
            href="/auth/register"
            className={cn(
              'text-blue-600 hover:underline',
              processing && 'pointer-events-none opacity-50'
            )}
          >
            Sign Up
          </Link>
        </p>
      </form>
    </>
  )
}

LoginPage.layout = (page: ReactElement) => <AuthLayout>{page}</AuthLayout>

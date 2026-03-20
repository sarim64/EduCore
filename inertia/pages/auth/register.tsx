import { type ReactElement } from 'react'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import AuthLayout from '~/layouts/AuthLayout'
import { Link, useForm } from '@inertiajs/react'
import { cn } from '~/lib/utils'
import { Head } from '@inertiajs/react'
import { FormField } from '~/components/FormField'

export default function RegisterPage() {
  const { errors, data, setData, post, processing } = useForm({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    passwordConfirmation: '',
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    post('register')
  }

  return (
    <>
      <Head title="EduCore - Register" />
      <div className="text-center">
        <p className="text-sm text-muted-foreground">Create your EduCore account</p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* First Name */}
        <FormField label="First Name" required error={errors?.firstName} className="relative">
          <Input
            name="firstName"
            type="text"
            placeholder="John"
            value={data.firstName}
            onChange={(e) => setData('firstName', e.target.value)}
            className="border border-gray-300 placeholder:text-gray-500 text-black"
          />
        </FormField>

        {/* Last Name */}
        <FormField label="Last Name" error={errors?.lastName} className="relative">
          <Input
            name="lastName"
            type="text"
            placeholder="Doe"
            aria-errormessage={errors?.lastName}
            value={data.lastName}
            onChange={(e) => setData('lastName', e.target.value)}
            className="border border-gray-300 placeholder:text-gray-500 text-black"
          />
        </FormField>

        {/* Email */}
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

        {/* Confirm Password */}
        <FormField
          label="Confirm Password"
          required
          error={errors?.passwordConfirmation}
          className="relative"
        >
          <Input
            name="passwordConfirmation"
            type="password"
            placeholder="••••••••"
            value={data.passwordConfirmation}
            onChange={(e) => setData('passwordConfirmation', e.target.value)}
            className="border border-gray-300 placeholder:text-gray-500 text-black"
          />
        </FormField>

        <Button type="submit" className="w-full" disabled={processing}>
          Sign Up
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link
            href="../auth/login"
            className={cn(
              'text-blue-600 hover:underline',
              processing && 'pointer-events-none opacity-50'
            )}
          >
            Sign In
          </Link>
        </p>
      </form>
    </>
  )
}

RegisterPage.layout = (page: ReactElement) => <AuthLayout>{page}</AuthLayout>

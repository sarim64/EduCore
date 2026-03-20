import { ReactElement } from 'react'
import { Head, useForm } from '@inertiajs/react'
import AuthLayout from '~/layouts/AuthLayout'
import { Input } from '~/components/ui/input'
import { FormField } from '~/components/FormField'
import { Button } from '~/components/ui/button'

export default function CreateSchoolPage() {
  const { data, setData, post, errors, processing } = useForm({
    name: '',
    code: '',
    address: '',
    phone: '',
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    post('/schools')
  }

  return (
    <div className="max-w-7xl w-full px-6 py-6 mx-auto">
      <Head title="Create School" />
      <form className="space-y-4" onSubmit={handleSubmit}>
        <FormField label="School Name" error={errors.name}>
          <Input
            name="name"
            type="text"
            placeholder="ABC School"
            aria-errormessage={errors?.name}
            value={data.name}
            onChange={(e) => setData('name', e.target.value)}
            className="border border-gray-300 placeholder:text-gray-500 text-black"
          />
        </FormField>

        <FormField label="School Code (Optional)" error={errors.code}>
          <Input
            name="code"
            type="text"
            placeholder="ABC-001"
            aria-errormessage={errors?.code}
            value={data.code}
            onChange={(e) => setData('code', e.target.value)}
            className="border border-gray-300 placeholder:text-gray-500 text-black"
          />
        </FormField>

        <FormField label="Address (Optional)" error={errors.address}>
          <Input
            name="address"
            type="text"
            placeholder="123 Main Street"
            aria-errormessage={errors?.address}
            value={data.address}
            onChange={(e) => setData('address', e.target.value)}
            className="border border-gray-300 placeholder:text-gray-500 text-black"
          />
        </FormField>

        <FormField label="Phone (Optional)" error={errors.phone}>
          <Input
            name="phone"
            type="text"
            placeholder="+1 234 567 890"
            aria-errormessage={errors?.phone}
            value={data.phone}
            onChange={(e) => setData('phone', e.target.value)}
            className="border border-gray-300 placeholder:text-gray-500 text-black"
          />
        </FormField>

        <Button type="submit" className="w-full" disabled={processing}>
          Create School
        </Button>
      </form>
    </div>
  )
}

CreateSchoolPage.layout = (page: ReactElement) => <AuthLayout>{page}</AuthLayout>

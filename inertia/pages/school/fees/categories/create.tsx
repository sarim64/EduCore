import { ReactElement } from 'react'
import { Head, Link, useForm } from '@inertiajs/react'
import DashboardLayout from '~/layouts/DashboardLayout'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Textarea } from '~/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { Switch } from '~/components/ui/switch'
import { FormField } from '~/components/FormField'

export default function FeeCategoryCreatePage({
  incomeAccounts,
}: {
  incomeAccounts: { id: string; code: string; name: string }[]
}) {
  const { data, setData, post, errors, processing } = useForm({
    name: '',
    code: '',
    description: '',
    incomeAccountId: '',
    isMandatory: false,
    isActive: true,
    displayOrder: 0,
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    post('/fees/categories')
  }

  return (
    <>
      <Head title="Create Fee Category" />

      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Create Fee Category</h1>
          <Link href="/fees/categories">
            <Button variant="outline">Back to List</Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Category Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormField label="Category Name" required htmlFor="name" error={errors.name}>
                <Input
                  id="name"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  className={errors.name ? 'border-red-500' : ''}
                />
              </FormField>

              <FormField label="Code" htmlFor="code" error={errors.code}>
                <Input
                  id="code"
                  value={data.code}
                  onChange={(e) => setData('code', e.target.value)}
                  placeholder="e.g., TUI, TRN, LAB"
                />
              </FormField>

              <FormField label="Description" htmlFor="description" error={errors.description}>
                <Textarea
                  id="description"
                  value={data.description}
                  onChange={(e) => setData('description', e.target.value)}
                  rows={3}
                />
              </FormField>

              <FormField
                label="Income Account"
                htmlFor="incomeAccountId"
                error={errors.incomeAccountId}
              >
                <Select
                  value={data.incomeAccountId || 'none'}
                  onValueChange={(value) =>
                    setData('incomeAccountId', value === 'none' ? '' : value)
                  }
                >
                  <SelectTrigger id="incomeAccountId" className="w-full">
                    <SelectValue placeholder="Select Income Account" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Select Income Account</SelectItem>
                    {incomeAccounts.map((account) => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.code} - {account.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label="Display Order" htmlFor="displayOrder" error={errors.displayOrder}>
                <Input
                  id="displayOrder"
                  type="number"
                  value={data.displayOrder}
                  onChange={(e) => setData('displayOrder', parseInt(e.target.value) || 0)}
                />
              </FormField>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField label="Mandatory Fee" htmlFor="isMandatory" error={errors.isMandatory}>
                  <Switch
                    id="isMandatory"
                    checked={data.isMandatory}
                    onCheckedChange={(checked) => setData('isMandatory', checked)}
                  />
                </FormField>

                <FormField label="Active" htmlFor="isActive" error={errors.isActive}>
                  <Switch
                    id="isActive"
                    checked={data.isActive}
                    onCheckedChange={(checked) => setData('isActive', checked)}
                  />
                </FormField>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={processing}>
                  {processing ? 'Creating...' : 'Create Category'}
                </Button>
                <Link href="/fees/categories">
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

FeeCategoryCreatePage.layout = (page: ReactElement) => <DashboardLayout>{page}</DashboardLayout>

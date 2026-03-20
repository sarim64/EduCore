import { ReactElement } from 'react'
import { Head, Link, useForm } from '@inertiajs/react'
import DashboardLayout from '~/layouts/DashboardLayout'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { FormField } from '~/components/FormField'
import { Input } from '~/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { Switch } from '~/components/ui/switch'

import type { LeaveType } from '~/types/attendance'

export default function EditLeaveTypePage({ leaveType }: { leaveType: LeaveType }) {
  const { data, setData, put, errors, processing } = useForm({
    name: leaveType.name,
    code: leaveType.code,
    description: leaveType.description || '',
    allowedDays: leaveType.allowedDays,
    isPaid: leaveType.isPaid,
    isActive: leaveType.isActive,
    appliesTo: leaveType.appliesTo,
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    put(`/attendance/leave-types/${leaveType.id}`)
  }

  return (
    <>
      <Head title="Edit Leave Type" />

      <div className="max-w-2xl">
        <div className="mb-6">
          <Link href="/attendance/leave-types" className="text-blue-600 hover:underline">
            &larr; Back to Leave Types
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Edit Leave Type</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Name" htmlFor="name" error={errors.name}>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Sick Leave"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    className="border border-gray-300"
                  />
                </FormField>

                <FormField label="Code" htmlFor="code" error={errors.code}>
                  <Input
                    id="code"
                    name="code"
                    placeholder="SL"
                    value={data.code}
                    onChange={(e) => setData('code', e.target.value.toUpperCase())}
                    className="border border-gray-300"
                  />
                </FormField>
              </div>

              <FormField label="Description" htmlFor="description" error={errors.description}>
                <Input
                  id="description"
                  name="description"
                  placeholder="Leave for medical reasons"
                  value={data.description}
                  onChange={(e) => setData('description', e.target.value)}
                  className="border border-gray-300"
                />
              </FormField>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Allowed Days per Year"
                  htmlFor="allowedDays"
                  error={errors.allowedDays}
                >
                  <Input
                    id="allowedDays"
                    name="allowedDays"
                    type="number"
                    min={0}
                    max={365}
                    value={data.allowedDays}
                    onChange={(e) => setData('allowedDays', parseInt(e.target.value) || 0)}
                    className="border border-gray-300"
                  />
                </FormField>

                <FormField label="Applies To" htmlFor="appliesTo" error={errors.appliesTo}>
                  <Select
                    value={data.appliesTo}
                    onValueChange={(value) =>
                      setData('appliesTo', value as 'all' | 'teaching' | 'non_teaching')
                    }
                  >
                    <SelectTrigger id="appliesTo" className="w-full">
                      <SelectValue placeholder="Select Applies To" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Staff</SelectItem>
                      <SelectItem value="teaching">Teaching Staff</SelectItem>
                      <SelectItem value="non_teaching">Non-Teaching Staff</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="Paid Leave" htmlFor="isPaid" error={errors.isPaid}>
                  <Switch
                    id="isPaid"
                    checked={data.isPaid}
                    onCheckedChange={(checked) => setData('isPaid', checked)}
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

              <div className="flex gap-2">
                <Button type="submit" disabled={processing}>
                  {processing ? 'Saving...' : 'Save Changes'}
                </Button>
                <Link href="/attendance/leave-types">
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

EditLeaveTypePage.layout = (page: ReactElement) => <DashboardLayout>{page}</DashboardLayout>

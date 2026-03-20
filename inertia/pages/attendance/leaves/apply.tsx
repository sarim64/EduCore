import { FormEvent, ReactElement } from 'react'
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
import { Textarea } from '~/components/ui/textarea'

import type { LeaveType } from '~/types/attendance'

export default function ApplyLeavePage({
  leaveTypes,
  errors: serverErrors,
}: {
  leaveTypes: LeaveType[]
  errors?: Record<string, string>
}) {
  const { data, setData, post, errors, processing } = useForm({
    leaveTypeId: '',
    startDate: '',
    endDate: '',
    reason: '',
  })

  const allErrors: Record<string, string> = { ...serverErrors, ...errors }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    post('/attendance/leaves')
  }

  return (
    <>
      <Head title="Apply for Leave" />

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Apply for Leave</h1>
          <Link href="/attendance/leaves">
            <Button variant="outline">Back to Applications</Button>
          </Link>
        </div>

        {allErrors?.general && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">{allErrors.general}</p>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Leave Application Form</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <FormField label="Leave Type" required htmlFor="leaveTypeId" error={allErrors.leaveTypeId}>
                <Select
                  value={data.leaveTypeId || 'none'}
                  onValueChange={(value) => setData('leaveTypeId', value === 'none' ? '' : value)}
                >
                  <SelectTrigger id="leaveTypeId" className="w-full">
                    <SelectValue placeholder="Select Leave Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Select Leave Type</SelectItem>
                    {leaveTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name} ({type.code})
                        {type.allowedDays ? ` - ${type.allowedDays} days allowed` : ''}
                        {type.isPaid ? ' (Paid)' : ' (Unpaid)'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="Start Date" required htmlFor="startDate" error={allErrors.startDate}>
                  <Input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={data.startDate}
                    onChange={(e) => setData('startDate', e.target.value)}
                    required
                  />
                </FormField>

                <FormField label="End Date" required htmlFor="endDate" error={allErrors.endDate}>
                  <Input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={data.endDate}
                    onChange={(e) => setData('endDate', e.target.value)}
                    required
                  />
                </FormField>
              </div>

              <FormField label="Reason" required htmlFor="reason" error={allErrors.reason}>
                <Textarea
                  id="reason"
                  name="reason"
                  value={data.reason}
                  onChange={(e) => setData('reason', e.target.value)}
                  placeholder="Please provide a reason for your leave request (minimum 10 characters)"
                  rows={4}
                  required
                />
              </FormField>

              <div className="flex gap-4">
                <Button type="submit" disabled={processing}>
                  {processing ? 'Submitting...' : 'Submit Application'}
                </Button>
                <Link href="/attendance/leaves">
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

ApplyLeavePage.layout = (page: ReactElement) => <DashboardLayout>{page}</DashboardLayout>

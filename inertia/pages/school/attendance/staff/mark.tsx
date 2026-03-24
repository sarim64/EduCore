import { ReactElement, useState } from 'react'
import { Head, Link, useForm } from '@inertiajs/react'
import DashboardLayout from '~/layouts/DashboardLayout'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { FormField } from '~/components/FormField'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'

import type { StaffMember } from '~/types/staff'

export default function MarkStaffAttendancePage({ staffMembers }: { staffMembers: StaffMember[] }) {
  const [searchTerm, setSearchTerm] = useState('')

  const { data, setData, post, errors, processing } = useForm({
    staffMemberId: '',
    date: new Date().toISOString().split('T')[0],
    status: 'present' as 'present' | 'absent' | 'late' | 'on_leave' | 'half_day',
    checkInTime: '',
    checkOutTime: '',
    remarks: '',
  })

  const filteredStaff = staffMembers.filter(
    (staff) =>
      `${staff.firstName} ${staff.lastName || ''}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      staff.staffMemberId.toLowerCase().includes(searchTerm.toLowerCase())
  )

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    post('/attendance/staff/mark')
  }

  function selectStaff(staff: StaffMember) {
    setData('staffMemberId', staff.id)
    setSearchTerm(`${staff.firstName} ${staff.lastName || ''}`)
  }

  return (
    <>
      <Head title="Mark Staff Attendance" />

      <div className="max-w-2xl">
        <div className="mb-6">
          <Link href="/attendance/staff" className="text-blue-600 hover:underline">
            &larr; Back to Staff Attendance
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Mark Staff Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormField label="Search Staff" htmlFor="staffSearch" error={errors.staffMemberId}>
                <Input
                  id="staffSearch"
                  placeholder="Search by name or staff ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border border-gray-300"
                />
                {searchTerm && !data.staffMemberId && filteredStaff.length > 0 && (
                  <div className="border rounded-md max-h-40 overflow-y-auto">
                    {filteredStaff.slice(0, 10).map((staff) => (
                      <button
                        key={staff.id}
                        type="button"
                        onClick={() => selectStaff(staff)}
                        className="w-full text-left px-3 py-2 hover:bg-gray-100"
                      >
                        {staff.firstName} {staff.lastName} ({staff.staffMemberId})
                      </button>
                    ))}
                  </div>
                )}
              </FormField>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="Date" htmlFor="date" error={errors.date}>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={data.date}
                    max={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setData('date', e.target.value)}
                    className="border border-gray-300"
                  />
                </FormField>

                <FormField label="Status" htmlFor="status" error={errors.status}>
                  <Select
                    value={data.status}
                    onValueChange={(value) =>
                      setData(
                        'status',
                        value as 'present' | 'absent' | 'late' | 'on_leave' | 'half_day'
                      )
                    }
                  >
                    <SelectTrigger id="status" className="w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="present">Present</SelectItem>
                      <SelectItem value="absent">Absent</SelectItem>
                      <SelectItem value="late">Late</SelectItem>
                      <SelectItem value="on_leave">On Leave</SelectItem>
                      <SelectItem value="half_day">Half Day</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="Check-in Time (Optional)" htmlFor="checkInTime" error={errors.checkInTime}>
                  <Input
                    id="checkInTime"
                    name="checkInTime"
                    type="time"
                    value={data.checkInTime}
                    onChange={(e) => setData('checkInTime', e.target.value)}
                    className="border border-gray-300"
                  />
                </FormField>

                <FormField label="Check-out Time (Optional)" htmlFor="checkOutTime" error={errors.checkOutTime}>
                  <Input
                    id="checkOutTime"
                    name="checkOutTime"
                    type="time"
                    value={data.checkOutTime}
                    onChange={(e) => setData('checkOutTime', e.target.value)}
                    className="border border-gray-300"
                  />
                </FormField>
              </div>

              <FormField label="Remarks (Optional)" htmlFor="remarks" error={errors.remarks}>
                <Input
                  id="remarks"
                  name="remarks"
                  placeholder="Add any remarks..."
                  value={data.remarks}
                  onChange={(e) => setData('remarks', e.target.value)}
                  className="border border-gray-300"
                />
              </FormField>

              <div className="flex gap-2">
                <Button type="submit" disabled={processing || !data.staffMemberId}>
                  {processing ? 'Saving...' : 'Mark Attendance'}
                </Button>
                <Link href="/attendance/staff">
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

MarkStaffAttendancePage.layout = (page: ReactElement) => <DashboardLayout>{page}</DashboardLayout>

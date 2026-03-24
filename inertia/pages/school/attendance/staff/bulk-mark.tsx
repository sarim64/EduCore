import { ReactElement, useEffect, useState } from 'react'
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'

import type { StaffAttendanceEntry } from '~/types/attendance'
import type { StaffMember } from '~/types/staff'

export default function BulkMarkStaffAttendancePage({
  staffMembers,
}: {
  staffMembers: StaffMember[]
}) {
  const [attendances, setAttendances] = useState<StaffAttendanceEntry[]>([])

  useEffect(() => {
    setAttendances(
      staffMembers.map((staff) => ({
        staffMemberId: staff.id,
        status: 'present' as const,
        checkInTime: '',
        checkOutTime: '',
        remarks: '',
      }))
    )
  }, [staffMembers])

  const { data, setData, post, errors, processing, transform } = useForm({
    date: new Date().toISOString().split('T')[0],
    attendances: [] as StaffAttendanceEntry[],
  })

  transform((formData) => ({
    ...formData,
    attendances,
  }))

  function updateAttendance(
    staffMemberId: string,
    field: keyof StaffAttendanceEntry,
    value: string
  ) {
    setAttendances((prev) =>
      prev.map((a) => (a.staffMemberId === staffMemberId ? { ...a, [field]: value } : a))
    )
  }

  function markAllAs(status: 'present' | 'absent' | 'late' | 'on_leave' | 'half_day') {
    setAttendances((prev) => prev.map((a) => ({ ...a, status })))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    post('/attendance/staff/bulk-mark')
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'present':
        return 'bg-green-100'
      case 'absent':
        return 'bg-red-100'
      case 'late':
        return 'bg-yellow-100'
      case 'on_leave':
        return 'bg-blue-100'
      case 'half_day':
        return 'bg-orange-100'
      default:
        return ''
    }
  }

  return (
    <>
      <Head title="Bulk Mark Staff Attendance" />

      <div className="space-y-6">
        <div className="mb-6">
          <Link href="/attendance/staff" className="text-blue-600 hover:underline">
            &larr; Back to Staff Attendance
          </Link>
        </div>

        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Bulk Mark Staff Attendance</h1>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="w-56">
              <FormField label="Date" htmlFor="date" error={errors.date}>
                <Input
                  id="date"
                  type="date"
                  value={data.date}
                  max={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setData('date', e.target.value)}
                />
              </FormField>
            </div>
            <div className="flex gap-2">
              <Button type="button" size="sm" variant="outline" onClick={() => markAllAs('present')}>
                All Present
              </Button>
              <Button type="button" size="sm" variant="outline" onClick={() => markAllAs('absent')}>
                All Absent
              </Button>
            </div>
          </CardHeader>
        </Card>

        {staffMembers.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Staff Members ({staffMembers.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead>Staff</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Check-in</TableHead>
                      <TableHead>Check-out</TableHead>
                      <TableHead>Remarks</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {staffMembers.map((staff, index) => {
                      const attendance = attendances.find((a) => a.staffMemberId === staff.id)
                      return (
                        <TableRow
                          key={staff.id}
                          className={getStatusColor(attendance?.status || '')}
                        >
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">
                                {staff.firstName} {staff.lastName}
                              </div>
                              <div className="text-sm text-gray-500">{staff.staffMemberId}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Select
                              value={attendance?.status || 'present'}
                              onValueChange={(value) => updateAttendance(staff.id, 'status', value)}
                            >
                              <SelectTrigger className="w-[140px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="present">Present</SelectItem>
                                <SelectItem value="absent">Absent</SelectItem>
                                <SelectItem value="late">Late</SelectItem>
                                <SelectItem value="on_leave">On Leave</SelectItem>
                                <SelectItem value="half_day">Half Day</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Input
                              type="time"
                              value={attendance?.checkInTime || ''}
                              onChange={(e) => updateAttendance(staff.id, 'checkInTime', e.target.value)}
                              className="w-28"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="time"
                              value={attendance?.checkOutTime || ''}
                              onChange={(e) => updateAttendance(staff.id, 'checkOutTime', e.target.value)}
                              className="w-28"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="text"
                              value={attendance?.remarks || ''}
                              onChange={(e) => updateAttendance(staff.id, 'remarks', e.target.value)}
                              placeholder="Remarks..."
                            />
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>

                {(errors as Record<string, string>).general && (
                  <p className="text-sm text-red-500 mt-4">
                    {(errors as Record<string, string>).general}
                  </p>
                )}

                <div className="flex gap-2 mt-6">
                  <Button type="submit" disabled={processing}>
                    {processing ? 'Saving...' : `Save Attendance (${staffMembers.length} staff)`}
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
        ) : (
          <Card>
            <CardContent className="py-8 text-center text-gray-500">
              No active staff members found.
            </CardContent>
          </Card>
        )}
      </div>
    </>
  )
}

BulkMarkStaffAttendancePage.layout = (page: ReactElement) => (
  <DashboardLayout>{page}</DashboardLayout>
)

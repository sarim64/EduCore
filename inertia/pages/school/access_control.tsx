import { Head } from '@inertiajs/react'
import { type ReactElement, useState } from 'react'
import { router } from '@inertiajs/react'
import DashboardLayout from '~/layouts/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Checkbox } from '~/components/ui/checkbox'
import { Button } from '~/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'

type Props = {
  settings: Record<string, Record<number, boolean>>
}

const ROLES = [
  { id: 4, label: 'Principal' },
  { id: 5, label: 'Vice Principal' },
  { id: 3, label: 'Accountant' },
  { id: 6, label: 'Teacher' },
  { id: 7, label: 'Support Staff' },
]

const CARD_ROWS = [
  { key: 'dashboard.cards.students', label: 'Total Students' },
  { key: 'dashboard.cards.student_attendance', label: 'Student Attendance (Today)' },
  { key: 'dashboard.cards.staff', label: 'Total Staff' },
  { key: 'dashboard.cards.staff_attendance', label: 'Staff Attendance (Today)' },
  { key: 'dashboard.cards.fee_today', label: 'Fee Collection (Today)' },
  { key: 'dashboard.cards.fee_month', label: 'Fee Collection (This Month)' },
]

const LIST_ROWS = [
  { key: 'dashboard.lists.low_attendance', label: 'Low Attendance Classes' },
  { key: 'dashboard.lists.attendance_by_class', label: "Today's Attendance by Class" },
  { key: 'dashboard.lists.chronically_absent', label: 'Chronically Absent Students' },
  { key: 'dashboard.lists.pending_leaves', label: 'Pending Leave Requests' },
  { key: 'dashboard.lists.fee_defaulters', label: 'Fee Defaulters' },
  { key: 'dashboard.lists.class_in_charge', label: 'Class In Charge' },
  { key: 'dashboard.lists.absent_staff', label: 'Absent Staff Today' },
  { key: 'dashboard.lists.quick_actions', label: 'Quick Actions' },
  { key: 'dashboard.lists.recent_activity', label: 'Recent Activity' },
  { key: 'dashboard.lists.alerts', label: 'Alerts & Notifications' },
]

const CHART_ROWS: { key: string; label: string }[] = []

export default function AccessControlPage({ settings }: Props) {
  const [state, setState] = useState(settings)

  function handleChange(permission: string, roleId: number, checked: boolean) {
    setState((prev) => ({
      ...prev,
      [permission]: {
        ...prev[permission],
        [roleId]: checked,
      },
    }))
  }

  function handleSave() {
    router.post('/access-control', { settings: state })
  }

  return (
    <>
      <Head title="Access Control" />

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Access Control</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Configure what each role can see and do within the system.
        </p>
      </div>

      {/* Dashboard Card Access */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Dashboard Card Access</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Dashboard Item</TableHead>
                {ROLES.map((role) => (
                  <TableHead key={role.id} className="text-center text-xs">
                    {role.label.includes(' ') ? (
                      <>
                        {role.label.split(' ')[0]}
                        <br />
                        {role.label.split(' ').slice(1).join(' ')}
                      </>
                    ) : (
                      role.label
                    )}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {CARD_ROWS.map((row) => (
                <TableRow key={row.key}>
                  <TableCell className="font-medium">{row.label}</TableCell>
                  {ROLES.map((role) => (
                    <TableCell key={role.id} className="text-center">
                      <Checkbox
                        checked={state[row.key]?.[role.id] ?? false}
                        onCheckedChange={(checked) =>
                          handleChange(row.key, role.id, Boolean(checked))
                        }
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dashboard List Items Access — coming soon */}
      {LIST_ROWS.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Dashboard List Items Access</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Dashboard Item</TableHead>
                  {ROLES.map((role) => (
                    <TableHead key={role.id} className="text-center text-xs">
                      {role.label.includes(' ') ? (
                        <>
                          {role.label.split(' ')[0]}
                          <br />
                          {role.label.split(' ').slice(1).join(' ')}
                        </>
                      ) : (
                        role.label
                      )}
                    </TableHead>
                  ))}
                </TableRow>
                <TableRow>
                  <TableHead
                    colSpan={6}
                    className="text-center text-xs text-amber-600 bg-amber-50"
                  >
                    Coming soon — these panels are not yet available on the dashboard
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {LIST_ROWS.map((row) => (
                  <TableRow key={row.key} className="opacity-50">
                    <TableCell className="font-medium">{row.label}</TableCell>
                    {ROLES.map((role) => (
                      <TableCell key={role.id} className="text-center">
                        <Checkbox
                          checked={state[row.key]?.[role.id] ?? false}
                          disabled
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Dashboard Chart Access */}
      {CHART_ROWS.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Dashboard Chart Access</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Dashboard Item</TableHead>
                  {ROLES.map((role) => (
                    <TableHead key={role.id} className="text-center text-xs">
                      {role.label.includes(' ') ? (
                        <>
                          {role.label.split(' ')[0]}
                          <br />
                          {role.label.split(' ').slice(1).join(' ')}
                        </>
                      ) : (
                        role.label
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {CHART_ROWS.map((row) => (
                  <TableRow key={row.key}>
                    <TableCell className="font-medium">{row.label}</TableCell>
                    {ROLES.map((role) => (
                      <TableCell key={role.id} className="text-center">
                        <Checkbox
                          checked={state[row.key]?.[role.id] ?? false}
                          onCheckedChange={(checked) =>
                            handleChange(row.key, role.id, Boolean(checked))
                          }
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Button onClick={handleSave}>Save Changes</Button>
    </>
  )
}

AccessControlPage.layout = (page: ReactElement) => <DashboardLayout>{page}</DashboardLayout>

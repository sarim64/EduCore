import { Head, Link } from '@inertiajs/react'
import { type ReactElement } from 'react'
import DashboardLayout from '~/layouts/DashboardLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { User, BookOpen, Users, Calendar, ClipboardCheck, GraduationCap } from 'lucide-react'
import type { TeacherDashboardStats } from '~/types/dashboard'

function getAttendanceColor(rate: number): string {
  if (rate >= 90) return 'bg-green-500'
  if (rate >= 75) return 'bg-yellow-500'
  return 'bg-red-500'
}

export default function TeacherDashboard({ stats }: { stats: TeacherDashboardStats }) {
  const uniqueSubjects = new Set(stats.assignments.subjects.map((s) => s.subjectName))

  return (
    <>
      <Head title="Teacher Dashboard" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Welcome, {stats.profile.name}</h2>
            <p className="text-muted-foreground">
              {stats.profile.designation || 'Teacher'}{' '}
              {stats.profile.department && `- ${stats.profile.department}`}
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/attendance/students">
              <Button>
                <ClipboardCheck className="mr-2 h-4 w-4" />
                Mark Attendance
              </Button>
            </Link>
          </div>
        </div>

        {/* Profile & Quick Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Staff ID</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.profile.staffMemberId}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Assignments</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.assignments.total}</div>
              <p className="text-xs text-muted-foreground">
                {uniqueSubjects.size} subject{uniqueSubjects.size !== 1 ? 's' : ''}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Class Teacher</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.assignments.classTeacherOf.length}</div>
              <p className="text-xs text-muted-foreground">
                {stats.assignments.classTeacherOf.length > 0
                  ? stats.assignments.classTeacherOf
                      .map((c) => `${c.className}${c.sectionName ? ` - ${c.sectionName}` : ''}`)
                      .join(', ')
                  : 'Not assigned'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Classes</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.todayClasses.length}</div>
              <p className="text-xs text-muted-foreground">Scheduled for today</p>
            </CardContent>
          </Card>
        </div>

        {/* Today's Attendance Overview */}
        {stats.attendance.myClassesToday.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Today's Class Attendance</CardTitle>
              <CardDescription>Attendance status for your classes today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={stats.attendance.myClassesToday}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="className"
                      tickFormatter={(value, index) => {
                        const item = stats.attendance.myClassesToday[index]
                        return item?.sectionName ? `${value}-${item.sectionName}` : value
                      }}
                    />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="present" fill="#10b981" name="Present" stackId="a" />
                    <Bar dataKey="absent" fill="#ef4444" name="Absent" stackId="a" />
                  </BarChart>
                </ResponsiveContainer>

                <div className="space-y-3">
                  {stats.attendance.myClassesToday.map((classItem, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <div>
                        <p className="font-medium">
                          {classItem.className}
                          {classItem.sectionName && ` - ${classItem.sectionName}`}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {classItem.present} present, {classItem.absent} absent of{' '}
                          {classItem.total}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-3 w-3 rounded-full ${getAttendanceColor(classItem.rate)}`}
                        />
                        <span className="font-semibold">{classItem.rate}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Subject Assignments & Recent Activity */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* My Subject Assignments */}
          <Card>
            <CardHeader>
              <CardTitle>My Subject Assignments</CardTitle>
              <CardDescription>Classes and subjects you are teaching</CardDescription>
            </CardHeader>
            <CardContent>
              {stats.assignments.subjects.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Class</TableHead>
                      <TableHead>Section</TableHead>
                      <TableHead>Subject</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stats.assignments.subjects.map((assignment, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{assignment.className}</TableCell>
                        <TableCell>{assignment.sectionName || '-'}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{assignment.subjectName}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Users className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No subject assignments yet</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Attendance Marked */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Attendance Marked</CardTitle>
              <CardDescription>Your recent attendance marking activity</CardDescription>
            </CardHeader>
            <CardContent>
              {stats.recentAttendanceMarked.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Students</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stats.recentAttendanceMarked.map((record, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{record.date}</TableCell>
                        <TableCell>
                          {record.className}
                          {record.sectionName && ` - ${record.sectionName}`}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{record.markedCount} marked</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <ClipboardCheck className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No attendance marked yet</p>
                  <Link href="/attendance/students" className="mt-2">
                    <Button variant="outline" size="sm">
                      Mark Attendance
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <Link href="/attendance/students">
                <Button variant="outline" className="w-full h-20 flex flex-col">
                  <ClipboardCheck className="h-6 w-6 mb-2" />
                  <span>Mark Attendance</span>
                </Button>
              </Link>
              <Link href="/attendance/reports">
                <Button variant="outline" className="w-full h-20 flex flex-col">
                  <Calendar className="h-6 w-6 mb-2" />
                  <span>Attendance Reports</span>
                </Button>
              </Link>
              <Link href="/students/members">
                <Button variant="outline" className="w-full h-20 flex flex-col">
                  <GraduationCap className="h-6 w-6 mb-2" />
                  <span>View Students</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

TeacherDashboard.layout = (page: ReactElement) => <DashboardLayout>{page}</DashboardLayout>

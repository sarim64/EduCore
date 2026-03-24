import { Head, Link } from '@inertiajs/react'
import { type ReactElement } from 'react'
import AnalyticsLayout from '~/layouts/AnalyticsLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Progress } from '~/components/ui/progress'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'
import {
  TrendLineChart,
  CategoryBarChart,
  StackedBarChart,
  formatCurrency,
  formatCurrencyShort,
  CHART_COLORS,
} from '~/components/charts'
import { DistributionPieChart } from '~/components/charts/DistributionPieChart'
import {
  Users,
  GraduationCap,
  UserCheck,
  TrendingUp,
  AlertTriangle,
  Calendar,
  FileText,
  Award,
  Building2,
} from 'lucide-react'
import type { PrincipalDashboardStats } from '~/types/dashboard'

function getAttendanceColor(rate: number): string {
  if (rate >= 90) return 'text-green-600'
  if (rate >= 75) return 'text-yellow-600'
  return 'text-red-600'
}

function getAlertIcon(type: 'warning' | 'info' | 'success') {
  switch (type) {
    case 'warning':
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />
    case 'success':
      return <Award className="h-4 w-4 text-green-500" />
    default:
      return <FileText className="h-4 w-4 text-blue-500" />
  }
}

export default function PrincipalDashboard({ stats }: { stats: PrincipalDashboardStats }) {
  const budgetUtilizationData = [
    { name: 'Utilized', value: stats.finance.utilized },
    { name: 'Remaining', value: stats.finance.remaining },
  ]

  return (
    <>
      <Head title="Principal Dashboard" />

      <div className="space-y-6">
        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.overview.totalStudents}</div>
              <p className="text-xs text-muted-foreground">
                {stats.overview.activeStudents} active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.overview.totalStaff}</div>
              <p className="text-xs text-muted-foreground">
                1:{stats.staffMetrics.teacherStudentRatio} teacher-student ratio
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Student Attendance</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-bold ${getAttendanceColor(stats.attendance.studentAttendanceRate)}`}
              >
                {stats.attendance.studentAttendanceRate}%
              </div>
              <p className="text-xs text-muted-foreground">Today's rate</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Budget Utilization</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.finance.utilizationRate}%</div>
              <Progress value={stats.finance.utilizationRate} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Second Row - More Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Classes</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.overview.totalClasses}</div>
              <p className="text-xs text-muted-foreground">
                {stats.overview.totalSections} sections
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Staff Attendance</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-bold ${getAttendanceColor(stats.attendance.staffAttendanceRate)}`}
              >
                {stats.attendance.staffAttendanceRate}%
              </div>
              <p className="text-xs text-muted-foreground">Today's rate</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.finance.totalBudget)}</div>
              <p className="text-xs text-muted-foreground">
                {formatCurrency(stats.finance.remaining)} remaining
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Staff Experience</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.staffMetrics.averageExperience} yrs</div>
              <p className="text-xs text-muted-foreground">Average tenure</p>
            </CardContent>
          </Card>
        </div>

        {/* Attendance Trend & Alerts */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Weekly Attendance Trend</CardTitle>
              <CardDescription>Student and staff attendance over the past week</CardDescription>
            </CardHeader>
            <CardContent>
              <StackedBarChart
                data={stats.attendance.weeklyTrend}
                categoryKey="date"
                bars={[
                  { key: 'studentRate', name: 'Students', color: CHART_COLORS.primary },
                  { key: 'staffRate', name: 'Staff', color: CHART_COLORS.success },
                ]}
                height={300}
                stacked={false}
                formatTooltip={(value) => `${value}%`}
              />
            </CardContent>
          </Card>

          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Alerts & Notifications</CardTitle>
              <CardDescription>Recent important updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.alerts.length > 0 ? (
                  stats.alerts.map((alert, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 rounded-lg border bg-muted/30"
                    >
                      {getAlertIcon(alert.type)}
                      <div className="flex-1">
                        <p className="text-sm">{alert.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">{alert.date}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-4">No alerts at this time</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Academic Performance & Low Attendance */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Class Performance</CardTitle>
              <CardDescription>Average scores by class</CardDescription>
            </CardHeader>
            <CardContent>
              <CategoryBarChart
                data={stats.academics.classPerformance.map((c) => ({
                  className: c.className,
                  score: c.averageScore,
                }))}
                categoryKey="className"
                valueKey="score"
                layout="vertical"
                color={CHART_COLORS.primary}
                height={300}
                categoryWidth={100}
                formatTooltip={(value) => `${value}%`}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Low Attendance Classes</CardTitle>
              <CardDescription>Classes with attendance below 80%</CardDescription>
            </CardHeader>
            <CardContent>
              {stats.attendance.lowAttendanceClasses.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Class</TableHead>
                      <TableHead>Section</TableHead>
                      <TableHead>Students</TableHead>
                      <TableHead>Rate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stats.attendance.lowAttendanceClasses.map((cls, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{cls.className}</TableCell>
                        <TableCell>{cls.sectionName || '-'}</TableCell>
                        <TableCell>{cls.totalStudents}</TableCell>
                        <TableCell>
                          <Badge variant={cls.rate < 70 ? 'destructive' : 'secondary'}>
                            {cls.rate}%
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Award className="h-12 w-12 text-green-500 mb-4" />
                  <p className="text-muted-foreground">All classes have good attendance!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Finance & Staff Distribution */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Monthly Expenses</CardTitle>
              <CardDescription>Expense trend over the year</CardDescription>
            </CardHeader>
            <CardContent>
              <TrendLineChart
                data={stats.finance.monthlyExpenses}
                xKey="month"
                yKey="amount"
                height={300}
                color={CHART_COLORS.warning}
                formatTooltip={formatCurrency}
                formatYAxis={formatCurrencyShort}
              />
            </CardContent>
          </Card>

          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Budget Utilization</CardTitle>
              <CardDescription>Budget allocation status</CardDescription>
            </CardHeader>
            <CardContent>
              <DistributionPieChart
                data={budgetUtilizationData}
                nameKey="name"
                valueKey="value"
                height={250}
                colors={[CHART_COLORS.primary, '#e5e7eb']}
                innerRadius={60}
                outerRadius={90}
                formatTooltip={formatCurrency}
              />
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Utilized</span>
                  <span className="font-medium">{formatCurrency(stats.finance.utilized)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Remaining</span>
                  <span className="font-medium">{formatCurrency(stats.finance.remaining)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Performers & Staff by Department */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Students</CardTitle>
              <CardDescription>Students with highest average scores</CardDescription>
            </CardHeader>
            <CardContent>
              {stats.academics.topPerformers.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rank</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Score</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stats.academics.topPerformers.map((student, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Badge variant={index < 3 ? 'default' : 'outline'}>#{index + 1}</Badge>
                        </TableCell>
                        <TableCell className="font-medium">{student.studentName}</TableCell>
                        <TableCell>{student.className}</TableCell>
                        <TableCell>
                          <span className="font-semibold text-green-600">
                            {student.averageScore}%
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex items-center justify-center py-8 text-muted-foreground">
                  No performance data available
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Staff by Department</CardTitle>
              <CardDescription>Distribution of staff across departments</CardDescription>
            </CardHeader>
            <CardContent>
              <CategoryBarChart
                data={stats.staffMetrics.departmentDistribution}
                categoryKey="department"
                valueKey="count"
                layout="vertical"
                color={CHART_COLORS.purple}
                height={300}
                categoryWidth={120}
              />
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <Link href="/reports/enrollment">
                <Button variant="outline" className="w-full h-20 flex flex-col">
                  <GraduationCap className="h-6 w-6 mb-2" />
                  <span>Enrollment Report</span>
                </Button>
              </Link>
              <Link href="/attendance/reports">
                <Button variant="outline" className="w-full h-20 flex flex-col">
                  <Calendar className="h-6 w-6 mb-2" />
                  <span>Attendance Reports</span>
                </Button>
              </Link>
              <Link href="/reports/income-expense">
                <Button variant="outline" className="w-full h-20 flex flex-col">
                  <TrendingUp className="h-6 w-6 mb-2" />
                  <span>Financial Summary</span>
                </Button>
              </Link>
              <Link href="/staff/members">
                <Button variant="outline" className="w-full h-20 flex flex-col">
                  <Users className="h-6 w-6 mb-2" />
                  <span>Staff Directory</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

PrincipalDashboard.layout = (page: ReactElement) => (
  <AnalyticsLayout
    title="Principal Dashboard"
    subtitle="School-wide analytics and performance metrics"
  >
    {page}
  </AnalyticsLayout>
)

import { Head } from '@inertiajs/react'
import { type ReactElement, useState } from 'react'
import ReportLayout from '~/layouts/ReportLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'
import { Badge } from '~/components/ui/badge'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '~/components/ui/collapsible'
import { CategoryBarChart, CHART_COLORS } from '~/components/charts'
import { DistributionPieChart } from '~/components/charts/DistributionPieChart'
import { GraduationCap, Users, Building2, ChevronDown, ChevronRight } from 'lucide-react'

import type { EnrollmentReportData } from '~/types/reports'

function getUtilizationColor(rate: number): string {
  if (rate >= 90) return 'text-red-600'
  if (rate >= 70) return 'text-yellow-600'
  return 'text-green-600'
}

export default function EnrollmentReport({
  report,
}: {
  report: EnrollmentReportData
  academicYears: { id: string; name: string; isCurrent: boolean }[]
  selectedYearId: string
}) {
  const [expandedClasses, setExpandedClasses] = useState<Set<string>>(new Set())

  const toggleClass = (classId: string) => {
    const newExpanded = new Set(expandedClasses)
    if (newExpanded.has(classId)) {
      newExpanded.delete(classId)
    } else {
      newExpanded.add(classId)
    }
    setExpandedClasses(newExpanded)
  }

  // Prepare chart data
  const classStrengthData = report.classes.map((cls) => ({
    name: cls.className,
    enrolled: cls.totalEnrolled,
    capacity: cls.totalCapacity,
  }))

  const genderChartData = report.genderDistribution.map((item) => ({
    gender: item.gender,
    count: item.count,
  }))

  return (
    <>
      <Head title="Enrollment Report" />

      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Enrollments</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{report.summary.totalEnrollments}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Capacity</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{report.summary.totalCapacity}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Utilization</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-bold ${getUtilizationColor(report.summary.utilizationRate)}`}
              >
                {report.summary.utilizationRate}%
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Classes</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{report.summary.totalClasses}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sections</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{report.summary.totalSections}</div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Class Strength</CardTitle>
              <CardDescription>Enrolled vs Capacity by class</CardDescription>
            </CardHeader>
            <CardContent>
              <CategoryBarChart
                data={classStrengthData}
                categoryKey="name"
                valueKey="enrolled"
                color={CHART_COLORS.primary}
                height={300}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Gender Distribution</CardTitle>
              <CardDescription>Students by gender</CardDescription>
            </CardHeader>
            <CardContent>
              <DistributionPieChart
                data={genderChartData}
                nameKey="gender"
                valueKey="count"
                height={300}
                emptyMessage="No data available"
              />
            </CardContent>
          </Card>
        </div>

        {/* Class Details */}
        <Card>
          <CardHeader>
            <CardTitle>Class-wise Details</CardTitle>
            <CardDescription>Click on a class to view enrolled students</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {report.classes.map((cls) => (
                <Collapsible
                  key={cls.classId}
                  open={expandedClasses.has(cls.classId)}
                  onOpenChange={() => toggleClass(cls.classId)}
                >
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4">
                      {expandedClasses.has(cls.classId) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                      <span className="font-medium">{cls.className}</span>
                      <Badge variant="secondary">{cls.sections.length} sections</Badge>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">
                        {cls.totalEnrolled} / {cls.totalCapacity} students
                      </span>
                      <Badge
                        variant={cls.totalEnrolled >= cls.totalCapacity ? 'destructive' : 'outline'}
                      >
                        {cls.totalCapacity > 0
                          ? Math.round((cls.totalEnrolled / cls.totalCapacity) * 100)
                          : 0}
                        % filled
                      </Badge>
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2 ml-8 space-y-4">
                    {cls.sections.map((section) => (
                      <div key={section.sectionId} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-medium">Section {section.sectionName}</h4>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-muted-foreground">
                              {section.enrolled} / {section.capacity}
                            </span>
                            <Badge variant="outline">{section.available} available</Badge>
                          </div>
                        </div>
                        {section.students.length > 0 ? (
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Roll No</TableHead>
                                <TableHead>Student ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Gender</TableHead>
                                <TableHead>Enrolled</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {section.students.map((student) => (
                                <TableRow key={student.studentId}>
                                  <TableCell>{student.rollNumber || '-'}</TableCell>
                                  <TableCell className="font-mono text-sm">
                                    {student.studentNumber}
                                  </TableCell>
                                  <TableCell>{student.name}</TableCell>
                                  <TableCell>{student.gender || '-'}</TableCell>
                                  <TableCell>{student.enrollmentDate}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        ) : (
                          <p className="text-sm text-muted-foreground text-center py-4">
                            No students enrolled in this section
                          </p>
                        )}
                      </div>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              ))}
              {report.classes.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No classes found for this academic year
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

EnrollmentReport.layout = (page: ReactElement) => (
  <ReportLayout
    title="Enrollment Report"
    subtitle="Class-wise enrollment statistics and student distribution"
  >
    {page}
  </ReportLayout>
)

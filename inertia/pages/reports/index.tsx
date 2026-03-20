import { Head, Link } from '@inertiajs/react'
import { type ReactElement } from 'react'
import DashboardLayout from '~/layouts/DashboardLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import {
  GraduationCap,
  Users,
  Calendar,
  FileText,
  BarChart3,
  ClipboardList,
  Building,
} from 'lucide-react'

interface ReportCard {
  title: string
  description: string
  href: string
  icon: React.ReactNode
  category: string
}

const reports: ReportCard[] = [
  // Student Reports
  {
    title: 'Enrollment Report',
    description:
      'View class-wise enrollment statistics, capacity utilization, and student distribution',
    href: '/reports/enrollment',
    icon: <GraduationCap className="h-8 w-8" />,
    category: 'Students',
  },
  // Staff Reports
  {
    title: 'Staff Directory',
    description: 'Complete staff listing organized by department with contact information',
    href: '/reports/staff-directory',
    icon: <Users className="h-8 w-8" />,
    category: 'Staff',
  },
  // Attendance Reports (link to existing)
  {
    title: 'Attendance Reports',
    description: 'Daily, monthly, and student-wise attendance reports with calendar view',
    href: '/attendance/reports',
    icon: <Calendar className="h-8 w-8" />,
    category: 'Attendance',
  },
  // Accounting Reports (link to existing)
  {
    title: 'Financial Statements',
    description: 'Trial Balance, Income Statement, and Balance Sheet reports',
    href: '/accounting/reports',
    icon: <FileText className="h-8 w-8" />,
    category: 'Accounting',
  },
]

const categories = ['Students', 'Staff', 'Attendance', 'Accounting']

export default function ReportsIndex() {
  return (
    <>
      <Head title="Reports" />

      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Reports</h2>
          <p className="text-muted-foreground">
            Generate and export comprehensive reports for your school
          </p>
        </div>

        {categories.map((category) => {
          const categoryReports = reports.filter((r) => r.category === category)
          if (categoryReports.length === 0) return null

          return (
            <div key={category}>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                {category === 'Students' && <GraduationCap className="h-5 w-5" />}
                {category === 'Staff' && <Users className="h-5 w-5" />}
                {category === 'Attendance' && <Calendar className="h-5 w-5" />}
                {category === 'Accounting' && <Building className="h-5 w-5" />}
                {category} Reports
              </h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {categoryReports.map((report) => (
                  <Link key={report.href} href={report.href}>
                    <Card className="h-full hover:border-primary/50 hover:shadow-md transition-all cursor-pointer">
                      <CardHeader>
                        <div className="flex items-center gap-4">
                          <div className="p-2 rounded-lg bg-primary/10 text-primary">
                            {report.icon}
                          </div>
                          <div>
                            <CardTitle className="text-lg">{report.title}</CardTitle>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-sm">{report.description}</CardDescription>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )
        })}

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Report Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium">PDF Export</h4>
                  <p className="text-sm text-muted-foreground">
                    Download reports as professionally formatted PDF documents
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-green-100 text-green-600">
                  <ClipboardList className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium">Excel Export</h4>
                  <p className="text-sm text-muted-foreground">
                    Export data to Excel for further analysis and processing
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium">Visual Charts</h4>
                  <p className="text-sm text-muted-foreground">
                    Interactive charts and graphs for data visualization
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

ReportsIndex.layout = (page: ReactElement) => <DashboardLayout>{page}</DashboardLayout>

import { Head } from '@inertiajs/react'
import { type ReactElement, useState } from 'react'
import DashboardLayout from '~/layouts/DashboardLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
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
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import {
  FileDown,
  FileSpreadsheet,
  Users,
  Building2,
  Briefcase,
  ChevronDown,
  ChevronRight,
  Search,
  Mail,
  Phone,
} from 'lucide-react'
import { exportToPDF, exportToExcel, type ExportColumn } from '~/lib/report_export'

import type { StaffDirectoryData } from '~/types/reports'

function getStatusBadge(status: string) {
  switch (status) {
    case 'active':
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          Active
        </Badge>
      )
    case 'inactive':
      return (
        <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
          Inactive
        </Badge>
      )
    case 'on_leave':
      return (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          On Leave
        </Badge>
      )
    case 'terminated':
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          Terminated
        </Badge>
      )
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

export default function StaffDirectoryReport({ report }: { report: StaffDirectoryData }) {
  const [expandedDepts, setExpandedDepts] = useState<Set<string>>(
    new Set(report.departments.map((d) => d.departmentId || 'unassigned'))
  )
  const [searchQuery, setSearchQuery] = useState('')

  const toggleDept = (deptId: string | null) => {
    const key = deptId || 'unassigned'
    const newExpanded = new Set(expandedDepts)
    if (newExpanded.has(key)) {
      newExpanded.delete(key)
    } else {
      newExpanded.add(key)
    }
    setExpandedDepts(newExpanded)
  }

  const filteredDepartments = report.departments
    .map((dept) => ({
      ...dept,
      staff: dept.staff.filter(
        (s) =>
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.staffNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (s.email && s.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (s.designation && s.designation.toLowerCase().includes(searchQuery.toLowerCase()))
      ),
    }))
    .filter((dept) => dept.staff.length > 0 || !searchQuery)

  const handleExportPDF = () => {
    const flatData: Record<string, unknown>[] = []
    report.departments.forEach((dept) => {
      dept.staff.forEach((s) => {
        flatData.push({
          department: dept.departmentName,
          staffNumber: s.staffNumber,
          name: s.name,
          designation: s.designation || '-',
          email: s.email || '-',
          phone: s.phone || '-',
          joiningDate: s.joiningDate || '-',
          status: s.status,
        })
      })
    })

    const columns: ExportColumn[] = [
      { header: 'Department', accessor: 'department', width: 25 },
      { header: 'Staff ID', accessor: 'staffNumber', width: 20 },
      { header: 'Name', accessor: 'name', width: 35 },
      { header: 'Designation', accessor: 'designation', width: 25 },
      { header: 'Email', accessor: 'email', width: 35 },
      { header: 'Phone', accessor: 'phone', width: 20 },
      { header: 'Status', accessor: 'status', width: 15 },
    ]

    exportToPDF({
      title: 'Staff Directory',
      subtitle: `Generated: ${new Date().toLocaleDateString()}`,
      filename: 'staff-directory',
      columns,
      data: flatData,
      orientation: 'landscape',
      summary: [
        { label: 'Total Staff', value: report.summary.totalStaff },
        { label: 'Active Staff', value: report.summary.activeStaff },
        { label: 'Departments', value: report.summary.departments },
      ],
    })
  }

  const handleExportExcel = () => {
    const flatData: Record<string, unknown>[] = []
    report.departments.forEach((dept) => {
      dept.staff.forEach((s) => {
        flatData.push({
          department: dept.departmentName,
          staffNumber: s.staffNumber,
          name: s.name,
          designation: s.designation || '-',
          email: s.email || '-',
          phone: s.phone || '-',
          joiningDate: s.joiningDate || '-',
          status: s.status,
        })
      })
    })

    const columns: ExportColumn[] = [
      { header: 'Department', accessor: 'department', width: 20 },
      { header: 'Staff ID', accessor: 'staffNumber', width: 15 },
      { header: 'Name', accessor: 'name', width: 25 },
      { header: 'Designation', accessor: 'designation', width: 20 },
      { header: 'Email', accessor: 'email', width: 30 },
      { header: 'Phone', accessor: 'phone', width: 15 },
      { header: 'Joining Date', accessor: 'joiningDate', width: 15 },
      { header: 'Status', accessor: 'status', width: 10 },
    ]

    exportToExcel({
      title: 'Staff Directory',
      filename: 'staff-directory',
      columns,
      data: flatData,
      summary: [
        { label: 'Total Staff', value: report.summary.totalStaff },
        { label: 'Active Staff', value: report.summary.activeStaff },
        { label: 'Departments', value: report.summary.departments },
      ],
    })
  }

  const deptChartData = report.departments.map((dept) => ({
    name: dept.departmentName,
    count: dept.count,
  }))

  return (
    <>
      <Head title="Staff Directory" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Staff Directory</h2>
            <p className="text-muted-foreground">Complete staff listing organized by department</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleExportPDF}>
              <FileDown className="mr-2 h-4 w-4" />
              PDF
            </Button>
            <Button variant="outline" onClick={handleExportExcel}>
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Excel
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{report.summary.totalStaff}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Staff</CardTitle>
              <Users className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{report.summary.activeStaff}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Departments</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{report.summary.departments}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Designations</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{report.summary.designations}</div>
            </CardContent>
          </Card>
        </div>

        {/* Staff by Department Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Staff by Department</CardTitle>
            <CardDescription>Number of staff members in each department</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={deptChartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={120} />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Search and Directory */}
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle>Staff List</CardTitle>
                <CardDescription>Click on a department to expand</CardDescription>
              </div>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search staff..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {filteredDepartments.map((dept) => (
                <Collapsible
                  key={dept.departmentId || 'unassigned'}
                  open={expandedDepts.has(dept.departmentId || 'unassigned')}
                  onOpenChange={() => toggleDept(dept.departmentId)}
                >
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4">
                      {expandedDepts.has(dept.departmentId || 'unassigned') ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                      <Building2 className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">{dept.departmentName}</span>
                    </div>
                    <Badge variant="secondary">{dept.staff.length} staff</Badge>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2 ml-8">
                    {dept.staff.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Staff ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Designation</TableHead>
                            <TableHead>Contact</TableHead>
                            <TableHead>Joined</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {dept.staff.map((staff) => (
                            <TableRow key={staff.staffMemberId}>
                              <TableCell className="font-mono text-sm">
                                {staff.staffNumber}
                              </TableCell>
                              <TableCell className="font-medium">{staff.name}</TableCell>
                              <TableCell>{staff.designation || '-'}</TableCell>
                              <TableCell>
                                <div className="flex flex-col gap-1">
                                  {staff.email && (
                                    <div className="flex items-center gap-1 text-sm">
                                      <Mail className="h-3 w-3" />
                                      <span className="truncate max-w-[150px]">{staff.email}</span>
                                    </div>
                                  )}
                                  {staff.phone && (
                                    <div className="flex items-center gap-1 text-sm">
                                      <Phone className="h-3 w-3" />
                                      <span>{staff.phone}</span>
                                    </div>
                                  )}
                                  {!staff.email && !staff.phone && '-'}
                                </div>
                              </TableCell>
                              <TableCell>{staff.joiningDate || '-'}</TableCell>
                              <TableCell>{getStatusBadge(staff.status)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4 border rounded-lg">
                        No staff members in this department
                      </p>
                    )}
                  </CollapsibleContent>
                </Collapsible>
              ))}
              {filteredDepartments.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  {searchQuery ? 'No staff members match your search' : 'No staff data available'}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

StaffDirectoryReport.layout = (page: ReactElement) => <DashboardLayout>{page}</DashboardLayout>

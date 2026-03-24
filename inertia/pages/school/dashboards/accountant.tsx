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

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts'
import { Wallet, Receipt, CreditCard, TrendingUp, Clock, FileText, Building } from 'lucide-react'
import type { AccountantDashboardStats } from '~/types'

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'pending':
      return (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          Pending
        </Badge>
      )
    case 'approved':
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          Approved
        </Badge>
      )
    case 'rejected':
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          Rejected
        </Badge>
      )
    case 'paid':
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          Paid
        </Badge>
      )
    case 'completed':
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          Completed
        </Badge>
      )
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

export default function AccountantDashboard({ stats }: { stats: AccountantDashboardStats }) {
  const expenseStatusData = [
    { name: 'Pending', value: stats.expenses.pending, color: '#f59e0b' },
    { name: 'Approved', value: stats.expenses.approved, color: '#3b82f6' },
    { name: 'Rejected', value: stats.expenses.rejected, color: '#ef4444' },
    { name: 'Paid', value: stats.expenses.paid, color: '#10b981' },
  ].filter((d) => d.value > 0)

  return (
    <>
      <Head title="Accountant Dashboard" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Accountant Dashboard</h2>
            <p className="text-muted-foreground">Manage expenses, payroll, and financial reports</p>
          </div>
          <div className="flex gap-2">
            <Link href="/accounting/expenses/create">
              <Button>
                <Receipt className="mr-2 h-4 w-4" />
                New Expense
              </Button>
            </Link>
          </div>
        </div>

        {/* Key Financial Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.expenses.totalAmount)}</div>
              <p className="text-xs text-muted-foreground">
                {stats.expenses.total} expense records
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {formatCurrency(stats.expenses.pendingAmount)}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.expenses.pending} pending expenses
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Last Payroll</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.payroll.lastRun ? formatCurrency(stats.payroll.lastRun.totalNetPay) : '$0'}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.payroll.lastRun
                  ? `${stats.payroll.lastRun.period} - ${stats.payroll.lastRun.staffMemberCount} staff`
                  : 'No payroll runs yet'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Payrolls</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.payroll.pendingRuns}</div>
              <p className="text-xs text-muted-foreground">Awaiting processing</p>
            </CardContent>
          </Card>
        </div>

        {/* Account Summary */}
        <div className="grid gap-4 md:grid-cols-5">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Accounts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{stats.accounts.totalAccounts}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-600">Assets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-green-600">
                {formatCurrency(stats.accounts.totalAssets)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-red-600">Liabilities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-red-600">
                {formatCurrency(stats.accounts.totalLiabilities)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-600">Income</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-blue-600">
                {formatCurrency(stats.accounts.totalIncome)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-orange-600">Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-orange-600">
                {formatCurrency(stats.accounts.totalExpense)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          {/* Expense Status Distribution */}
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Expense Status Distribution</CardTitle>
              <CardDescription>Breakdown of expenses by status</CardDescription>
            </CardHeader>
            <CardContent>
              {expenseStatusData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={expenseStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {expenseStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[250px] text-muted-foreground">
                  No expense data available
                </div>
              )}
            </CardContent>
          </Card>

          {/* Monthly Payroll Trend */}
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Monthly Payroll Trend</CardTitle>
              <CardDescription>Net pay disbursements this year</CardDescription>
            </CardHeader>
            <CardContent>
              {stats.payroll.monthlyTrend.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={stats.payroll.monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                    <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Net Pay']} />
                    <Line
                      type="monotone"
                      dataKey="netPay"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={{ fill: '#10b981' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[250px] text-muted-foreground">
                  No payroll data available
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Expenses by Category */}
        {stats.expenses.byCategory.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Expenses by Category</CardTitle>
              <CardDescription>Total expenses grouped by category</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.expenses.byCategory} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tickFormatter={(value) => formatCurrency(value)} />
                  <YAxis dataKey="category" type="category" width={120} />
                  <Tooltip
                    formatter={(value, name) => {
                      if (name === 'amount') return [formatCurrency(Number(value)), 'Amount']
                      return [value, name]
                    }}
                  />
                  <Bar dataKey="amount" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Recent Expenses Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Expenses</CardTitle>
              <CardDescription>Latest expense records</CardDescription>
            </div>
            <Link href="/accounting/expenses">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {stats.expenses.recentExpenses.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Expense #</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.expenses.recentExpenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell className="font-medium">{expense.expenseNumber}</TableCell>
                      <TableCell>{expense.date}</TableCell>
                      <TableCell>{expense.vendorName || '-'}</TableCell>
                      <TableCell>{formatCurrency(expense.amount)}</TableCell>
                      <TableCell>{getStatusBadge(expense.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Receipt className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No expenses recorded yet</p>
                <Link href="/accounting/expenses/create" className="mt-2">
                  <Button variant="outline" size="sm">
                    Add First Expense
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <Link href="/accounting/expenses">
                <Button variant="outline" className="w-full h-20 flex flex-col">
                  <Receipt className="h-6 w-6 mb-2" />
                  <span>Manage Expenses</span>
                </Button>
              </Link>
              <Link href="/payroll/runs">
                <Button variant="outline" className="w-full h-20 flex flex-col">
                  <CreditCard className="h-6 w-6 mb-2" />
                  <span>Payroll Runs</span>
                </Button>
              </Link>
              <Link href="/accounting/reports">
                <Button variant="outline" className="w-full h-20 flex flex-col">
                  <FileText className="h-6 w-6 mb-2" />
                  <span>Financial Reports</span>
                </Button>
              </Link>
              <Link href="/accounting/chart-of-accounts">
                <Button variant="outline" className="w-full h-20 flex flex-col">
                  <Building className="h-6 w-6 mb-2" />
                  <span>Chart of Accounts</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

AccountantDashboard.layout = (page: ReactElement) => <DashboardLayout>{page}</DashboardLayout>

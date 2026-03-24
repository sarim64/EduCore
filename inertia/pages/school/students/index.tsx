import { ReactElement, useState } from 'react'
import { Head, Link, useForm, router } from '@inertiajs/react'
import DashboardLayout from '~/layouts/DashboardLayout'
import { Button } from '~/components/ui/button'
import { Card, CardContent } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import type { PaginatedStudents } from '~/types/students'

export default function StudentsIndexPage({
  students,
  filters,
}: {
  students: PaginatedStudents
  filters: { search: string; status: string }
}) {
  const { delete: destroy, processing } = useForm()
  const [statusFilter, setStatusFilter] = useState(filters.status || 'all')

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    router.get('/students', {
      search: formData.get('search') as string,
      status: statusFilter === 'all' ? '' : statusFilter,
    })
  }

  function handleDelete(id: string) {
    if (confirm('Are you sure you want to delete this student?')) {
      destroy(`/students/${id}`)
    }
  }

  return (
    <>
      <Head title="Students" />

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Students</h1>
          <div className="flex gap-2">
            <Link href="/students/import">
              <Button variant="outline">Import Students</Button>
            </Link>
            <Link href="/students/create">
              <Button>Add Student</Button>
            </Link>
          </div>
        </div>

        {/* Search and Filter */}
        <Card>
          <CardContent className="py-4">
            <form onSubmit={handleSearch} className="flex gap-4">
              <Input
                name="search"
                placeholder="Search by name, ID, or email..."
                defaultValue={filters.search}
                className="flex-1 border border-gray-300"
              />
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value)}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="graduated">Graduated</SelectItem>
                  <SelectItem value="transferred">Transferred</SelectItem>
                </SelectContent>
              </Select>
              <Button type="submit">Search</Button>
            </form>
          </CardContent>
        </Card>

        {/* Student List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Student ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Class
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.data.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No students found.
                  </td>
                </tr>
              ) : (
                students.data.map((student) => {
                  const currentEnrollment =
                    Array.isArray(student.enrollments) && student.enrollments.length > 0
                      ? student.enrollments[0]
                      : null
                  return (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {student.studentId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {student.firstName} {student.lastName}
                        </div>
                        {student.email && (
                          <div className="text-sm text-gray-500">{student.email}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {currentEnrollment?.class ? (
                          <>
                            {currentEnrollment.class.name}
                            {currentEnrollment.section && ` - ${currentEnrollment.section.name}`}
                          </>
                        ) : (
                          <span className="text-gray-400">Not enrolled</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            student.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : student.status === 'graduated'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {student.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <Link href={`/students/${student.id}`}>
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                          </Link>
                          <Link href={`/students/${student.id}/edit`}>
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                          </Link>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(student.id)}
                            disabled={processing}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {students.meta.lastPage > 1 && (
          <div className="flex justify-center gap-2">
            {Array.from({ length: students.meta.lastPage }, (_, i) => i + 1).map((page) => (
              <Link
                key={page}
                href={`/students?page=${page}&search=${filters.search}&status=${filters.status}`}
                className={`px-3 py-1 rounded ${
                  page === students.meta.currentPage
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {page}
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

StudentsIndexPage.layout = (page: ReactElement) => <DashboardLayout>{page}</DashboardLayout>

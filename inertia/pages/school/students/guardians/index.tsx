import { ReactElement } from 'react'
import { Head, Link, useForm } from '@inertiajs/react'
import DashboardLayout from '~/layouts/DashboardLayout'
import { Button } from '~/components/ui/button'

import type { Guardian } from '~/types/students'

export default function GuardiansIndexPage({
  guardians,
}: {
  guardians: (Guardian & {
    students: { id: string; firstName: string; lastName: string | null }[]
  })[]
}) {
  const { delete: destroy, processing } = useForm()
  const guardiansList = Array.isArray(guardians) ? guardians : []

  function handleDelete(id: string) {
    if (confirm('Are you sure you want to delete this guardian?')) {
      destroy(`/guardians/${id}`)
    }
  }

  return (
    <>
      <Head title="Guardians" />

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Guardians</h1>
          <Link href="/guardians/create">
            <Button>Add Guardian</Button>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Relation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Students
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {guardiansList.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No guardians found.
                  </td>
                </tr>
              ) : (
                guardiansList.map((guardian) => {
                  const students = Array.isArray(guardian.students) ? guardian.students : []
                  return (
                    <tr key={guardian.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {guardian.firstName} {guardian.lastName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                      {guardian.relation}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{guardian.phone}</div>
                      {guardian.email && (
                        <div className="text-sm text-gray-500">{guardian.email}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {students.length > 0
                        ? students.map((s) => `${s.firstName} ${s.lastName || ''}`).join(', ')
                        : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <Link href={`/guardians/${guardian.id}/edit`}>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </Link>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(guardian.id)}
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
      </div>
    </>
  )
}

GuardiansIndexPage.layout = (page: ReactElement) => <DashboardLayout>{page}</DashboardLayout>

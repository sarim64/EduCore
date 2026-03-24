import { ReactElement } from 'react'
import { Head, Link, useForm } from '@inertiajs/react'
import DashboardLayout from '~/layouts/DashboardLayout'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'

import type { StaffMember, StaffDocument } from '~/types/staff'

const documentTypeLabels: Record<string, string> = {
  identity: 'Identity',
  educational: 'Educational',
  experience: 'Experience',
  medical: 'Medical',
  other: 'Other',
}

function formatFileSize(bytes: number | null): string {
  if (!bytes) return 'Unknown'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function DocumentsIndexPage({
  staff,
  documents,
}: {
  staff: StaffMember
  documents: StaffDocument[]
}) {
  const { delete: destroy, processing } = useForm()

  function handleDelete(documentId: string) {
    if (confirm('Are you sure you want to delete this document?')) {
      destroy(`/staff/members/${staff.id}/documents/${documentId}`)
    }
  }

  return (
    <>
      <Head title={`Documents - ${staff.fullName}`} />

      <div className="space-y-6">
        <div className="mb-6">
          <Link href={`/staff/members/${staff.id}`} className="text-blue-600 hover:underline">
            &larr; Back to {staff.fullName}
          </Link>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Documents</h1>
            <p className="text-gray-600">
              {staff.fullName} ({staff.staffMemberId})
            </p>
          </div>
          <Link href={`/staff/members/${staff.id}/documents/create`}>
            <Button>Add Document</Button>
          </Link>
        </div>

        <div className="grid gap-4">
          {documents.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-gray-500">
                No documents uploaded. Add one to get started.
              </CardContent>
            </Card>
          ) : (
            documents.map((document) => (
              <Card key={document.id}>
                <CardHeader className="flex flex-row items-center justify-between py-4">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {document.name}
                      <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-600">
                        {documentTypeLabels[document.type] || document.type}
                      </span>
                    </CardTitle>
                    <div className="text-sm text-gray-600 mt-1 space-y-1">
                      {document.fileType && <p>File Type: {document.fileType}</p>}
                      <p>Size: {formatFileSize(document.fileSize)}</p>
                      {document.notes && <p className="italic">{document.notes}</p>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={document.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex"
                    >
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </a>
                    <Link href={`/staff/members/${staff.id}/documents/${document.id}/edit`}>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(document.id)}
                      disabled={processing}
                    >
                      Delete
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            ))
          )}
        </div>
      </div>
    </>
  )
}

DocumentsIndexPage.layout = (page: ReactElement) => <DashboardLayout>{page}</DashboardLayout>

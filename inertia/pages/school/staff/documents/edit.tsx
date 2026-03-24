import { ReactElement } from 'react'
import { Head, Link, useForm } from '@inertiajs/react'
import DashboardLayout from '~/layouts/DashboardLayout'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { FormField } from '~/components/FormField'

import type { StaffMember, StaffDocument } from '~/types/staff'

export default function EditDocumentPage({
  staff,
  document,
}: {
  staff: StaffMember
  document: StaffDocument
}) {
  const { data, setData, put, errors, processing } = useForm({
    name: document.name,
    type: document.type,
    fileUrl: document.fileUrl,
    fileType: document.fileType || '',
    fileSize: document.fileSize || 0,
    notes: document.notes || '',
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    put(`/staff/members/${staff.id}/documents/${document.id}`)
  }

  return (
    <>
      <Head title={`Edit Document - ${staff.fullName}`} />

      <div className="max-w-2xl">
        <div className="mb-6">
          <Link
            href={`/staff/members/${staff.id}/documents`}
            className="text-blue-600 hover:underline"
          >
            &larr; Back to Documents
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Edit Document</CardTitle>
            <p className="text-sm text-gray-600">
              {staff.fullName} ({staff.staffMemberId})
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormField label="Document Name" required error={errors.name}>
                <Input
                  id="name"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  placeholder="e.g., CNIC Copy, Resume"
                  className="border border-gray-300"
                />
              </FormField>

              <FormField label="Document Type" required error={errors.type}>
                <Select value={data.type} onValueChange={(value) => setData('type', value)}>
                  <SelectTrigger id="type" className="w-full">
                    <SelectValue placeholder="Select Document Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="identity">Identity (CNIC, Passport, etc.)</SelectItem>
                    <SelectItem value="educational">Educational (Degrees, Certificates)</SelectItem>
                    <SelectItem value="experience">Experience (Job Letters, References)</SelectItem>
                    <SelectItem value="medical">Medical (Health Certificates)</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label="File URL" required error={errors.fileUrl}>
                <Input
                  id="fileUrl"
                  value={data.fileUrl}
                  onChange={(e) => setData('fileUrl', e.target.value)}
                  placeholder="/uploads/staff/documents/filename.pdf"
                  className="border border-gray-300"
                />
              </FormField>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="File Type" error={errors.fileType}>
                  <Input
                    id="fileType"
                    value={data.fileType}
                    onChange={(e) => setData('fileType', e.target.value)}
                    placeholder="e.g., application/pdf"
                    className="border border-gray-300"
                  />
                </FormField>

                <FormField label="File Size (bytes)" error={errors.fileSize}>
                  <Input
                    id="fileSize"
                    type="number"
                    value={data.fileSize}
                    onChange={(e) => setData('fileSize', parseInt(e.target.value) || 0)}
                    className="border border-gray-300"
                  />
                </FormField>
              </div>

              <FormField label="Notes" error={errors.notes}>
                <Input
                  id="notes"
                  value={data.notes}
                  onChange={(e) => setData('notes', e.target.value)}
                  placeholder="Optional notes about this document"
                  className="border border-gray-300"
                />
              </FormField>

              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={processing}>
                  {processing ? 'Saving...' : 'Save Changes'}
                </Button>
                <Link href={`/staff/members/${staff.id}/documents`}>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

EditDocumentPage.layout = (page: ReactElement) => <DashboardLayout>{page}</DashboardLayout>

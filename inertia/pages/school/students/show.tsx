import { ReactElement, useState } from 'react'
import { Head, Link, useForm } from '@inertiajs/react'
import DashboardLayout from '~/layouts/DashboardLayout'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Label } from '~/components/ui/label'
import { Input } from '~/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import type { Student, StudentDocument } from '~/types/students'
import type { SchoolClass, AcademicYear } from '~/types/academics'

export default function ShowStudentPage({
  student,
  guardians,
  enrollments,
  classes,
  academicYears,
  documents,
  availableGuardians,
}: {
  student: Student
  guardians: Student['guardians']
  enrollments: Student['enrollments']
  classes: SchoolClass[]
  academicYears: AcademicYear[]
  documents: StudentDocument[]
  availableGuardians: Array<{
    id: string
    firstName: string
    lastName: string | null
    relation: string
  }>
}) {
  const [showEnrollForm, setShowEnrollForm] = useState(false)
  const [showAttachGuardianForm, setShowAttachGuardianForm] = useState(false)
  const [selectedClassId, setSelectedClassId] = useState('')
  const linkedGuardians = guardians ?? []
  const studentEnrollments = enrollments ?? []
  const safeDocuments = documents ?? []
  const guardiansToAttach = availableGuardians ?? []

  const enrollForm = useForm({
    studentId: student.id,
    academicYearId: '',
    classId: '',
    sectionId: '',
    rollNumber: '',
    enrollmentDate: new Date().toISOString().split('T')[0],
  })

  const documentForm = useForm({
    name: '',
    type: 'birth_certificate',
    file: null as File | null,
  })

  const deleteEnrollment = useForm()
  const deleteGuardian = useForm()
  const deleteDocument = useForm()
  const attachGuardianForm = useForm({
    guardianId: '',
    isPrimary: false,
    isEmergencyContact: false,
    canPickup: true,
  })

  const selectedClass = classes.find((c) => c.id === selectedClassId)

  function handleEnroll(e: React.FormEvent) {
    e.preventDefault()
    enrollForm.post('/students/enrollments', {
      onSuccess: () => {
        enrollForm.reset()
        setShowEnrollForm(false)
        setSelectedClassId('')
      },
    })
  }

  function handleDeleteEnrollment(enrollmentId: string) {
    if (confirm('Are you sure you want to remove this enrollment?')) {
      deleteEnrollment.delete(`/students/enrollments/${enrollmentId}`)
    }
  }

  function handleDetachGuardian(guardianId: string) {
    if (confirm('Are you sure you want to remove this guardian?')) {
      deleteGuardian.delete(`/students/${student.id}/guardians/${guardianId}`)
    }
  }

  function handleAttachGuardian(e: React.FormEvent) {
    e.preventDefault()
    attachGuardianForm.post(`/students/${student.id}/guardians`, {
      onSuccess: () => {
        attachGuardianForm.setData('guardianId', '')
        attachGuardianForm.setData('isPrimary', false)
        attachGuardianForm.setData('isEmergencyContact', false)
        attachGuardianForm.setData('canPickup', true)
        setShowAttachGuardianForm(false)
      },
    })
  }

  function handleUploadDocument(e: React.FormEvent) {
    e.preventDefault()
    documentForm.post(`/students/${student.id}/documents`, {
      forceFormData: true,
      onSuccess: () => {
        documentForm.reset()
      },
    })
  }

  function handleDeleteDocument(documentId: string) {
    if (confirm('Are you sure you want to delete this document?')) {
      deleteDocument.delete(`/students/${student.id}/documents/${documentId}`)
    }
  }

  function formatFileSize(bytes: number | null): string {
    if (!bytes) return 'N/A'
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return (
    <>
      <Head title={`${student.firstName} ${student.lastName || ''}`} />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <Link href="/students" className="text-blue-600 hover:underline text-sm">
              &larr; Back to Students
            </Link>
            <h1 className="text-2xl font-bold mt-2">
              {student.firstName} {student.lastName}
            </h1>
            <p className="text-gray-500">Student ID: {student.studentId}</p>
            <span
              className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${
                student.status === 'active'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {student.status}
            </span>
          </div>
          <Link href={`/students/${student.id}/edit`}>
            <Button>Edit Student</Button>
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Student Details */}
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Student Information</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-4">
                {student.dateOfBirth && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Date of Birth</dt>
                    <dd className="text-sm text-gray-900">{student.dateOfBirth}</dd>
                  </div>
                )}
                {student.gender && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Gender</dt>
                    <dd className="text-sm text-gray-900 capitalize">{student.gender}</dd>
                  </div>
                )}
                {student.bloodGroup && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Blood Group</dt>
                    <dd className="text-sm text-gray-900">{student.bloodGroup}</dd>
                  </div>
                )}
                {student.religion && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Religion</dt>
                    <dd className="text-sm text-gray-900">{student.religion}</dd>
                  </div>
                )}
                {student.nationality && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Nationality</dt>
                    <dd className="text-sm text-gray-900">{student.nationality}</dd>
                  </div>
                )}
                {student.email && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                    <dd className="text-sm text-gray-900">{student.email}</dd>
                  </div>
                )}
                {student.phone && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Phone</dt>
                    <dd className="text-sm text-gray-900">{student.phone}</dd>
                  </div>
                )}
                {student.address && (
                  <div className="col-span-2">
                    <dt className="text-sm font-medium text-gray-500">Address</dt>
                    <dd className="text-sm text-gray-900">
                      {student.address}
                      {student.city && `, ${student.city}`}
                      {student.state && `, ${student.state}`}
                      {student.postalCode && `, ${student.postalCode}`}
                      {student.country && `, ${student.country}`}
                    </dd>
                  </div>
                )}
                {student.emergencyContactName && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Emergency Contact</dt>
                    <dd className="text-sm text-gray-900">{student.emergencyContactName}</dd>
                  </div>
                )}
                {student.emergencyContactPhone && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Emergency Phone</dt>
                    <dd className="text-sm text-gray-900">{student.emergencyContactPhone}</dd>
                  </div>
                )}
                {student.medicalConditions && (
                  <div className="col-span-2">
                    <dt className="text-sm font-medium text-gray-500">Medical Conditions</dt>
                    <dd className="text-sm text-gray-900">{student.medicalConditions}</dd>
                  </div>
                )}
                {student.allergies && (
                  <div className="col-span-2">
                    <dt className="text-sm font-medium text-gray-500">Allergies</dt>
                    <dd className="text-sm text-gray-900">{student.allergies}</dd>
                  </div>
                )}
                {student.admissionDate && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Admission Date</dt>
                    <dd className="text-sm text-gray-900">{student.admissionDate}</dd>
                  </div>
                )}
                {student.previousSchool && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Previous School</dt>
                    <dd className="text-sm text-gray-900">{student.previousSchool}</dd>
                  </div>
                )}
              </dl>
            </CardContent>
          </Card>

          {/* Guardians */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Guardians</CardTitle>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowAttachGuardianForm(!showAttachGuardianForm)}
                >
                  {showAttachGuardianForm ? 'Cancel Link' : 'Link Existing'}
                </Button>
                <Link href={`/guardians/create?studentId=${student.id}`}>
                  <Button size="sm">Add New</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {showAttachGuardianForm && (
                <form onSubmit={handleAttachGuardian} className="mb-4 p-3 border rounded-md space-y-3">
                  <div className="space-y-2">
                    <Label>Guardian</Label>
                    <Select
                      value={attachGuardianForm.data.guardianId || undefined}
                      onValueChange={(value) => attachGuardianForm.setData('guardianId', value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select guardian" />
                      </SelectTrigger>
                      <SelectContent>
                        {guardiansToAttach.map((guardian) => (
                          <SelectItem key={guardian.id} value={guardian.id}>
                            {guardian.firstName} {guardian.lastName ?? ''} ({guardian.relation})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {guardiansToAttach.length === 0 && (
                      <p className="text-xs text-gray-500">
                        No available guardians to link. Create a new guardian instead.
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={attachGuardianForm.data.isPrimary}
                        onChange={(e) => attachGuardianForm.setData('isPrimary', e.target.checked)}
                      />
                      Primary
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={attachGuardianForm.data.isEmergencyContact}
                        onChange={(e) =>
                          attachGuardianForm.setData('isEmergencyContact', e.target.checked)
                        }
                      />
                      Emergency Contact
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={attachGuardianForm.data.canPickup}
                        onChange={(e) => attachGuardianForm.setData('canPickup', e.target.checked)}
                      />
                      Can Pickup
                    </label>
                  </div>

                  <Button
                    type="submit"
                    size="sm"
                    disabled={
                      attachGuardianForm.processing ||
                      guardiansToAttach.length === 0 ||
                      !attachGuardianForm.data.guardianId
                    }
                  >
                    {attachGuardianForm.processing ? 'Linking...' : 'Link Guardian'}
                  </Button>
                </form>
              )}

              {linkedGuardians.length === 0 ? (
                <p className="text-gray-500 text-sm">No guardians assigned</p>
              ) : (
                <div className="space-y-3">
                  {linkedGuardians.map((guardian) => (
                    <div key={guardian.id} className="border-b pb-2 last:border-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-sm">
                            {guardian.firstName} {guardian.lastName}
                          </p>
                          <p className="text-xs text-gray-500 capitalize">{guardian.relation}</p>
                          <p className="text-xs text-gray-500">{guardian.phone}</p>
                          {guardian.$extras?.pivot_is_primary && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-1 rounded">
                              Primary
                            </span>
                          )}
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDetachGuardian(guardian.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Enrollments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Enrollments</CardTitle>
            <Button size="sm" onClick={() => setShowEnrollForm(!showEnrollForm)}>
              {showEnrollForm ? 'Cancel' : 'Enroll in Class'}
            </Button>
          </CardHeader>
          <CardContent>
            {showEnrollForm && (
              <form onSubmit={handleEnroll} className="mb-4 p-4 border rounded-lg bg-gray-50">
                <div className="grid grid-cols-5 gap-4">
                  <div className="space-y-2">
                    <Label>Academic Year</Label>
                    <Select
                      value={enrollForm.data.academicYearId || undefined}
                      onValueChange={(value) => enrollForm.setData('academicYearId', value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Year" />
                      </SelectTrigger>
                      <SelectContent>
                        {academicYears.map((year) => (
                          <SelectItem key={year.id} value={year.id}>
                            {year.name} {year.isCurrent && '(Current)'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Class</Label>
                    <Select
                      value={enrollForm.data.classId || undefined}
                      onValueChange={(value) => {
                        enrollForm.setData('classId', value)
                        setSelectedClassId(value)
                        enrollForm.setData('sectionId', '')
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Class" />
                      </SelectTrigger>
                      <SelectContent>
                        {classes.map((cls) => (
                          <SelectItem key={cls.id} value={cls.id}>
                            {cls.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Section</Label>
                    <Select
                      value={enrollForm.data.sectionId || undefined}
                      onValueChange={(value) => enrollForm.setData('sectionId', value)}
                      disabled={!selectedClass}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Section" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedClass?.sections?.map((section) => (
                          <SelectItem key={section.id} value={section.id}>
                            {section.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Roll Number</Label>
                    <Input
                      value={enrollForm.data.rollNumber}
                      onChange={(e) => enrollForm.setData('rollNumber', e.target.value)}
                      placeholder="Optional"
                      className="border border-gray-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Enrollment Date</Label>
                    <Input
                      type="date"
                      value={enrollForm.data.enrollmentDate}
                      onChange={(e) => enrollForm.setData('enrollmentDate', e.target.value)}
                      className="border border-gray-300"
                    />
                  </div>
                </div>
                <Button type="submit" className="mt-4" disabled={enrollForm.processing}>
                  {enrollForm.processing ? 'Enrolling...' : 'Enroll Student'}
                </Button>
              </form>
            )}

            {studentEnrollments.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No enrollments yet. Enroll this student in a class.
              </p>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase py-2">
                      Academic Year
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase py-2">
                      Class
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase py-2">
                      Section
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase py-2">
                      Roll No
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase py-2">
                      Status
                    </th>
                    <th className="text-right text-xs font-medium text-gray-500 uppercase py-2">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {studentEnrollments.map((enrollment) => (
                    <tr key={enrollment.id}>
                      <td className="py-2 text-sm">{enrollment.academicYear.name}</td>
                      <td className="py-2 text-sm">{enrollment.class.name}</td>
                      <td className="py-2 text-sm">{enrollment.section?.name || '-'}</td>
                      <td className="py-2 text-sm">{enrollment.rollNumber || '-'}</td>
                      <td className="py-2 text-sm">
                        <span
                          className={`px-2 py-0.5 text-xs rounded-full ${
                            enrollment.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {enrollment.status}
                        </span>
                      </td>
                      <td className="py-2 text-right">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteEnrollment(enrollment.id)}
                          disabled={deleteEnrollment.processing}
                        >
                          Remove
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>

        {/* Documents */}
        <Card>
          <CardHeader>
            <CardTitle>Documents</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Upload Form */}
            <form onSubmit={handleUploadDocument} className="space-y-4 border-b pb-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="documentName">Document Name</Label>
                  <Input
                    id="documentName"
                    value={documentForm.data.name}
                    onChange={(e) => documentForm.setData('name', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="documentType">Document Type</Label>
                  <Select
                    value={documentForm.data.type || undefined}
                    onValueChange={(value) => documentForm.setData('type', value)}
                  >
                    <SelectTrigger id="documentType" className="w-full">
                      <SelectValue placeholder="Select document type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="birth_certificate">Birth Certificate</SelectItem>
                      <SelectItem value="transfer_certificate">Transfer Certificate</SelectItem>
                      <SelectItem value="medical_record">Medical Record</SelectItem>
                      <SelectItem value="id_proof">ID Proof</SelectItem>
                      <SelectItem value="photo">Photo</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="documentFile">File</Label>
                  <Input
                    id="documentFile"
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        documentForm.setData('file', file)
                      }
                    }}
                    required
                  />
                </div>
              </div>
              <Button type="submit" disabled={documentForm.processing}>
                {documentForm.processing ? 'Uploading...' : 'Upload Document'}
              </Button>
              {documentForm.errors.file && (
                <p className="text-sm text-red-600">{documentForm.errors.file}</p>
              )}
            </form>

            {/* Documents List */}
            {safeDocuments.length === 0 ? (
              <p className="text-sm text-gray-500">No documents uploaded yet.</p>
            ) : (
              <div className="space-y-2">
                {safeDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-3 border rounded hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm">{doc.name}</p>
                      <p className="text-xs text-gray-500">
                        {doc.type.replace('_', ' ')} • {doc.fileName} •{' '}
                        {formatFileSize(doc.fileSize)} •{' '}
                        {new Date(doc.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/students/${student.id}/documents/${doc.id}/download`}>
                        <Button variant="outline" size="sm">
                          Download
                        </Button>
                      </Link>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteDocument(doc.id)}
                        disabled={deleteDocument.processing}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}

ShowStudentPage.layout = (page: ReactElement) => <DashboardLayout>{page}</DashboardLayout>

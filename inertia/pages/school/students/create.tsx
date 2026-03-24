import { ReactElement } from 'react'
import { Head, Link } from '@inertiajs/react'
import DashboardLayout from '~/layouts/DashboardLayout'
import AdmissionWizard from '~/components/students/AdmissionWizard'

export default function CreateStudentPage({
  academicYears,
  classes,
}: {
  academicYears?: Array<{ id: string; name: string }>
  classes?: Array<{ id: string; name: string }>
}) {
  return (
    <>
      <Head title="Student Admission" />

      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Link href="/students" className="text-blue-600 hover:underline">
            &larr; Back to Students
          </Link>
          <h1 className="text-3xl font-bold mt-2">New Student Admission</h1>
          <p className="text-gray-600 mt-1">Complete the admission process in 5 simple steps</p>
        </div>

        <AdmissionWizard academicYears={academicYears} classes={classes} />
      </div>
    </>
  )
}

CreateStudentPage.layout = (page: ReactElement) => <DashboardLayout>{page}</DashboardLayout>

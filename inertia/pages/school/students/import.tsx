import { type ReactElement } from 'react'
import { Head, Link, useForm } from '@inertiajs/react'
import DashboardLayout from '~/layouts/DashboardLayout'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { FormField } from '~/components/FormField'
import { Upload, Download, FileSpreadsheet, AlertCircle } from 'lucide-react'

export default function ImportStudentsPage() {
  const { data, setData, post, errors, processing } = useForm({
    file: null as File | null,
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    post('/students/import')
  }

  function downloadTemplate() {
    const csvContent = `firstName,lastName,dateOfBirth,gender,bloodGroup,religion,nationality,email,phone,address,city,state,postalCode,country,admissionDate,previousSchool,emergencyContactName,emergencyContactPhone,medicalConditions,allergies
John,Doe,2010-01-15,male,A+,Christian,American,john.doe@example.com,+1234567890,123 Main St,New York,NY,10001,USA,2024-01-10,ABC School,Jane Doe,+0987654321,None,Peanuts
Jane,Smith,2011-03-20,female,B+,Muslim,Canadian,jane.smith@example.com,+1234567891,456 Oak Ave,Toronto,ON,M1M1M1,Canada,2024-01-10,XYZ School,John Smith,+0987654322,Asthma,None`

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'student_import_template.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <>
      <Head title="Bulk Import Students" />

      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/students" className="text-blue-600 hover:underline">
            &larr; Back to Students
          </Link>
          <h1 className="text-3xl font-bold mt-2">Bulk Import Students</h1>
          <p className="text-gray-600 mt-1">
            Import multiple students at once using a CSV or Excel file
          </p>
        </div>

        {/* Instructions Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-blue-600" />
              How to Import Students
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Download the CSV template by clicking the button below</li>
              <li>Fill in student information in the template (one student per row)</li>
              <li>
                Required field: <strong>firstName</strong> - all other fields are optional
              </li>
              <li>Save the file and upload it using the form below</li>
              <li>Review the import results and fix any errors if needed</li>
            </ol>

            <Button
              type="button"
              variant="outline"
              onClick={downloadTemplate}
              className="w-full sm:w-auto"
            >
              <Download className="w-4 h-4 mr-2" />
              Download CSV Template
            </Button>
          </CardContent>
        </Card>

        {/* Upload Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-green-600" />
              Upload File
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <FormField label="Select CSV or Excel File" required error={errors.file}>
                <Input
                  id="file"
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={(e) => setData('file', e.target.files?.[0] || null)}
                  className="cursor-pointer"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Supported formats: CSV (.csv), Excel (.xlsx, .xls). Maximum file size: 5MB
                </p>
              </FormField>

              {data.file && (
                <div className="bg-green-50 border border-green-200 rounded-md p-4">
                  <p className="text-sm text-green-800">
                    <strong>File selected:</strong> {data.file.name}
                  </p>
                  <p className="text-xs text-green-700 mt-1">
                    Size: {(data.file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              )}

              <div className="flex gap-2">
                <Button type="submit" disabled={processing || !data.file}>
                  <Upload className="w-4 h-4 mr-2" />
                  {processing ? 'Importing...' : 'Import Students'}
                </Button>
                <Link href="/students">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Field Reference */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">CSV Field Reference</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Personal Information</h4>
                <ul className="space-y-1 text-gray-700">
                  <li>
                    • <code className="bg-gray-100 px-1">firstName</code> (required)
                  </li>
                  <li>
                    • <code className="bg-gray-100 px-1">lastName</code>
                  </li>
                  <li>
                    • <code className="bg-gray-100 px-1">dateOfBirth</code> (YYYY-MM-DD)
                  </li>
                  <li>
                    • <code className="bg-gray-100 px-1">gender</code> (male/female/other)
                  </li>
                  <li>
                    • <code className="bg-gray-100 px-1">bloodGroup</code> (A+, B-, etc.)
                  </li>
                  <li>
                    • <code className="bg-gray-100 px-1">religion</code>
                  </li>
                  <li>
                    • <code className="bg-gray-100 px-1">nationality</code>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Contact Information</h4>
                <ul className="space-y-1 text-gray-700">
                  <li>
                    • <code className="bg-gray-100 px-1">email</code>
                  </li>
                  <li>
                    • <code className="bg-gray-100 px-1">phone</code>
                  </li>
                  <li>
                    • <code className="bg-gray-100 px-1">address</code>
                  </li>
                  <li>
                    • <code className="bg-gray-100 px-1">city</code>
                  </li>
                  <li>
                    • <code className="bg-gray-100 px-1">state</code>
                  </li>
                  <li>
                    • <code className="bg-gray-100 px-1">postalCode</code>
                  </li>
                  <li>
                    • <code className="bg-gray-100 px-1">country</code>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Academic Information</h4>
                <ul className="space-y-1 text-gray-700">
                  <li>
                    • <code className="bg-gray-100 px-1">admissionDate</code> (YYYY-MM-DD)
                  </li>
                  <li>
                    • <code className="bg-gray-100 px-1">previousSchool</code>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Emergency & Medical</h4>
                <ul className="space-y-1 text-gray-700">
                  <li>
                    • <code className="bg-gray-100 px-1">emergencyContactName</code>
                  </li>
                  <li>
                    • <code className="bg-gray-100 px-1">emergencyContactPhone</code>
                  </li>
                  <li>
                    • <code className="bg-gray-100 px-1">medicalConditions</code>
                  </li>
                  <li>
                    • <code className="bg-gray-100 px-1">allergies</code>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

ImportStudentsPage.layout = (page: ReactElement) => <DashboardLayout>{page}</DashboardLayout>

import { useState } from 'react'
import { useForm } from '@inertiajs/react'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Progress } from '~/components/ui/progress'
import { ChevronLeft, ChevronRight, Check } from 'lucide-react'
import { FormField } from '../FormField'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Textarea } from '../ui/textarea'

interface AdmissionWizardProps {
  academicYears?: Array<{ id: string; name: string }>
  classes?: Array<{ id: string; name: string }>
}

const STEPS = [
  { id: 1, title: 'Personal Information', description: 'Basic details about the student' },
  { id: 2, title: 'Contact & Address', description: 'How to reach the student' },
  { id: 3, title: 'Guardian Information', description: 'Parent/Guardian details' },
  { id: 4, title: 'Academic & Medical', description: 'School and health information' },
  { id: 5, title: 'Documents', description: 'Create student and continue to upload documents' },
]

export default function AdmissionWizard({ academicYears, classes }: AdmissionWizardProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const safeStep = Math.min(Math.max(currentStep, 1), STEPS.length)
  const activeStep = STEPS[safeStep - 1] ?? STEPS[0]

  const { data, setData, post, errors, processing } = useForm({
    // Step 1: Personal Information
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    bloodGroup: '',
    religion: '',
    nationality: '',

    // Step 2: Contact & Address
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',

    // Step 3: Guardian Information (simplified - full guardian creation happens after student is created)
    emergencyContactName: '',
    emergencyContactPhone: '',

    // Step 4: Academic & Medical
    academicYearId: '',
    classId: '',
    admissionDate: '',
    previousSchool: '',
    medicalConditions: '',
    allergies: '',

    // Step 5: Documents (handled separately after student creation)
    // Documents will be uploaded after the student is created
  })

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length))
  }

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
  }

  const handleCreateStudent = () => {
    if (safeStep !== STEPS.length) return
    post('/students')
  }

  const handleCreateStudentOnly = () => {
    if (safeStep !== STEPS.length) return
    post('/students?after=index')
  }

  const progressPercentage = (safeStep / STEPS.length) * 100

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex-1">
              <div className="flex items-center">
                <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                    safeStep > step.id
                      ? 'bg-green-500 border-green-500 text-white'
                      : safeStep === step.id
                        ? 'bg-blue-500 border-blue-500 text-white'
                        : 'bg-white border-gray-300 text-gray-500'
                  }`}
                >
                  {safeStep > step.id ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-semibold">{step.id}</span>
                  )}
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 transition-colors ${
                      safeStep > step.id ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
              <div className="mt-2 hidden md:block">
                <p
                  className={`text-sm font-medium ${
                    safeStep === step.id ? 'text-blue-600' : 'text-gray-600'
                  }`}
                >
                  {step.title}
                </p>
                <p className="text-xs text-gray-500">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>{activeStep.title}</CardTitle>
            <p className="text-sm text-gray-600">{activeStep.description}</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Personal Information */}
            {safeStep === 1 && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    label="First Name"
                    required
                    error={errors?.firstName}
                    className="relative"
                  >
                    <Input
                      id="firstName"
                      value={data.firstName}
                      onChange={(e) => setData('firstName', e.target.value)}
                      className="border border-gray-300"
                      required
                    />
                  </FormField>

                  <FormField label="Last Name" error={errors?.lastName} className="relative">
                    <Input
                      id="lastName"
                      value={data.lastName}
                      onChange={(e) => setData('lastName', e.target.value)}
                      className="border border-gray-300"
                    />
                  </FormField>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <FormField label="Date of Birth" error={errors?.dateOfBirth} className="relative">
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={data.dateOfBirth}
                      onChange={(e) => setData('dateOfBirth', e.target.value)}
                      className="border border-gray-300"
                    />
                  </FormField>

                  <FormField label="Gender" error={errors?.gender} required className="relative">
                    <Select value={data.gender} onValueChange={(value) => setData('gender', value)}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormField>

                  <FormField
                    label="Blood Group"
                    error={errors?.bloodGroup}
                    required
                    className="relative"
                  >
                    <Select
                      value={data.bloodGroup}
                      onValueChange={(value) => setData('bloodGroup', value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A+">A+</SelectItem>
                        <SelectItem value="A-">A-</SelectItem>
                        <SelectItem value="B+">B+</SelectItem>
                        <SelectItem value="B-">B-</SelectItem>
                        <SelectItem value="O+">O+</SelectItem>
                        <SelectItem value="O-">O-</SelectItem>
                        <SelectItem value="AB+">AB+</SelectItem>
                        <SelectItem value="AB-">AB-</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormField>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    label="Religion"
                    error={errors?.religion}
                    required
                    className="relative"
                  >
                    <Input
                      id="religion"
                      value={data.religion}
                      onChange={(e) => setData('religion', e.target.value)}
                      className="border border-gray-300"
                    />
                  </FormField>

                  <FormField
                    label="Nationality"
                    error={errors?.nationality}
                    required
                    className="relative"
                  >
                    <Input
                      id="nationality"
                      value={data.nationality}
                      onChange={(e) => setData('nationality', e.target.value)}
                      className="border border-gray-300"
                    />
                  </FormField>
                </div>
              </>
            )}

            {/* Step 2: Contact & Address */}
            {safeStep === 2 && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    label="Email Address"
                    error={errors?.email}
                    required
                    className="relative"
                  >
                    <Input
                      id="email"
                      type="email"
                      value={data.email}
                      onChange={(e) => setData('email', e.target.value)}
                      className="border border-gray-300"
                    />
                  </FormField>

                  <FormField label="Phone" error={errors?.phone} className="relative">
                    <Input
                      id="phone"
                      type="tel"
                      value={data.phone}
                      onChange={(e) => setData('phone', e.target.value)}
                      className="border border-gray-300"
                    />
                  </FormField>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={data.address}
                    onChange={(e) => setData('address', e.target.value)}
                    className="border border-gray-300"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField label="City" error={errors?.city} className="relative">
                    <Input
                      id="city"
                      value={data.city}
                      onChange={(e) => setData('city', e.target.value)}
                      className="border border-gray-300"
                    />
                  </FormField>

                  <FormField label="State/Province" error={errors?.state} className="relative">
                    <Input
                      id="state"
                      value={data.state}
                      onChange={(e) => setData('state', e.target.value)}
                      className="border border-gray-300"
                    />
                  </FormField>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Postal Code" error={errors?.postalCode} className="relative">
                    <Input
                      id="postalCode"
                      value={data.postalCode}
                      onChange={(e) => setData('postalCode', e.target.value)}
                      className="border border-gray-300"
                    />
                  </FormField>

                  <FormField label="Country" error={errors?.country} className="relative">
                    <Input
                      id="country"
                      value={data.country}
                      onChange={(e) => setData('country', e.target.value)}
                      className="border border-gray-300"
                    />
                  </FormField>
                </div>
              </>
            )}

            {/* Step 3: Guardian Information */}
            {safeStep === 3 && (
              <>
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> You can add detailed guardian information after creating
                    the student. For now, provide emergency contact details.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    label="Emergency Contact Name"
                    error={errors?.emergencyContactName}
                    className="relative"
                  >
                    <Input
                      id="emergencyContactName"
                      value={data.emergencyContactName}
                      onChange={(e) => setData('emergencyContactName', e.target.value)}
                      className="border border-gray-300"
                    />
                  </FormField>

                  <FormField
                    label="Emergency Contact Phone"
                    error={errors?.emergencyContactPhone}
                    className="relative"
                  >
                    <Input
                      id="emergencyContactPhone"
                      type="tel"
                      value={data.emergencyContactPhone}
                      onChange={(e) => setData('emergencyContactPhone', e.target.value)}
                      className="border border-gray-300"
                    />
                  </FormField>
                </div>
              </>
            )}

            {/* Step 4: Academic & Medical */}
            {safeStep === 4 && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    label="Academic Year"
                    error={errors?.academicYearId}
                    className="relative"
                  >
                    <Select
                      value={data.academicYearId}
                      onValueChange={(value) => setData('academicYearId', value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Academic Year" />
                      </SelectTrigger>
                      <SelectContent>
                        {academicYears?.map((year) => (
                          <SelectItem key={year.id} value={year.id}>
                            {year.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormField>

                  <FormField label="Class" error={errors?.classId} className="relative">
                    <Select
                      value={data.classId}
                      onValueChange={(value) => setData('classId', value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Class" />
                      </SelectTrigger>
                      <SelectContent>
                        {classes?.map((cls) => (
                          <SelectItem key={cls.id} value={cls.id}>
                            {cls.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.classId && <p className="text-sm text-red-500">{errors.classId}</p>}
                  </FormField>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    label="Admission Date"
                    error={errors?.admissionDate}
                    className="relative"
                  >
                    <Input
                      id="admissionDate"
                      type="date"
                      value={data.admissionDate}
                      onChange={(e) => setData('admissionDate', e.target.value)}
                      className="border border-gray-300"
                    />
                  </FormField>

                  <FormField
                    label="Previous School"
                    error={errors?.previousSchool}
                    className="relative"
                  >
                    <Input
                      id="previousSchool"
                      value={data.previousSchool}
                      onChange={(e) => setData('previousSchool', e.target.value)}
                      className="border border-gray-300"
                    />
                  </FormField>
                </div>

                <FormField
                  label="Medical Conditions"
                  error={errors?.medicalConditions}
                  className="relative"
                >
                  <Textarea
                    id="medicalConditions"
                    value={data.medicalConditions}
                    onChange={(e) => setData('medicalConditions', e.target.value)}
                    placeholder="Any medical conditions we should be aware of..."
                  />
                </FormField>

                <FormField label="Allergies" error={errors?.allergies} className="relative">
                  <Textarea
                    id="allergies"
                    value={data.allergies}
                    onChange={(e) => setData('allergies', e.target.value)}
                    placeholder="Any allergies we should be aware of..."
                  />
                </FormField>
              </>
            )}

            {/* Step 5: Documents */}
            {safeStep === 5 && (
              <>
                <div className="bg-green-50 border border-green-200 rounded-md p-4">
                  <p className="text-sm text-green-800">
                    <strong>Almost Done!</strong> Click "Create & Continue to Documents" to create
                    the student and continue directly to the document upload screen.
                  </p>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-md p-6">
                  <h4 className="font-semibold mb-2">You can upload these documents later:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    <li>Birth Certificate</li>
                    <li>Previous School Transfer Certificate</li>
                    <li>Medical Records</li>
                    <li>Proof of Residence</li>
                    <li>Passport Size Photo</li>
                    <li>Other relevant documents</li>
                  </ul>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrevious}
            disabled={safeStep === 1}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          {safeStep < STEPS.length ? (
            <Button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                handleNext()
              }}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={processing}
                onClick={handleCreateStudentOnly}
              >
                {processing ? 'Creating...' : 'Create Student'}
              </Button>
              <Button type="button" disabled={processing} onClick={handleCreateStudent}>
                {processing ? 'Creating...' : 'Create & Continue to Documents'}
              </Button>
            </div>
          )}
        </div>

        {/* Step Indicator for Mobile */}
        <div className="mt-4 text-center text-sm text-gray-600 md:hidden">
          Step {safeStep} of {STEPS.length}
        </div>
      </form>
    </div>
  )
}

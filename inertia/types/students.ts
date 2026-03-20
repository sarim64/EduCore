export type StudentEnrollment = {
  id: string
  rollNumber: string | null
  status: string
  enrollmentDate?: string
  class: { id: string; name: string }
  section: { id: string; name: string } | null
  academicYear: { id: string; name: string }
}

export type Student = {
  id: string
  studentId: string
  firstName: string
  lastName: string | null
  fullName?: string
  dateOfBirth?: string | null
  admissionDate?: string | null
  gender?: string | null
  bloodGroup?: string | null
  religion?: string | null
  nationality?: string | null
  email: string | null
  phone: string | null
  address?: string | null
  city?: string | null
  state?: string | null
  postalCode?: string | null
  country?: string | null
  previousSchool?: string | null
  emergencyContactName?: string | null
  emergencyContactPhone?: string | null
  medicalConditions?: string | null
  allergies?: string | null
  status: string
  enrollments: StudentEnrollment[]
  guardians?: Guardian[]
}

export type Guardian = {
  id: string
  firstName: string
  lastName: string | null
  relation: string
  phone: string
  email: string | null
  alternatePhone?: string | null
  address?: string | null
  city?: string | null
  state?: string | null
  postalCode?: string | null
  country?: string | null
  occupation?: string | null
  workplace?: string | null
  nationalId?: string | null
  $extras?: {
    pivot_is_primary?: boolean
    pivot_is_emergency_contact?: boolean
  }
}

export type StudentDocument = {
  id: string
  name: string
  type: string
  fileName: string
  fileSize: number | null
  createdAt: string
}

export type PaginatedStudents = {
  data: Student[]
  meta: {
    total: number
    perPage: number
    currentPage: number
    lastPage: number
  }
}

export type Department = {
  id: string
  name: string
  description?: string | null
  isActive?: boolean
  headId?: string | null
}

export type Designation = {
  id: string
  name: string
  departmentId?: string
  description?: string | null
  isActive?: boolean
  department?: Department | null
}

export type LinkedUser = {
  id: string
  firstName: string
  lastName: string | null
  email: string
  isInCurrentSchool?: boolean
  fullName: string
}

export type StaffMember = {
  id: string
  staffMemberId: string
  userId?: string | null
  firstName: string
  lastName: string | null
  fullName: string
  dateOfBirth?: string | null
  gender?: string | null
  bloodGroup?: string | null
  maritalStatus?: string | null
  nationality?: string | null
  nationalId?: string | null
  email: string | null
  phone: string | null
  alternatePhone?: string | null
  address?: string | null
  city?: string | null
  state?: string | null
  postalCode?: string | null
  country?: string | null
  emergencyContactName?: string | null
  emergencyContactPhone?: string | null
  emergencyContactRelation?: string | null
  joiningDate?: string | null
  employmentType: string
  basicSalary?: number
  bankName?: string | null
  bankAccountNumber?: string | null
  departmentId?: string | null
  designationId?: string | null
  status: string
  department: Department | null
  designation: Designation | null
  user?: LinkedUser | null
}

export type StaffDocument = {
  id: string
  name: string
  type: string
  fileUrl: string
  fileType: string | null
  fileSize: number | null
  notes: string | null
}

export type StaffQualification = {
  id: string
  degree: string
  fieldOfStudy: string | null
  institution: string
  year: number
  grade: string | null
  certificateUrl: string | null
}

export type TeacherAssignment = {
  id: string
  staffMemberId: string
  academicYearId: string
  classId: string
  sectionId: string | null
  subjectId: string
  isClassTeacher: boolean
  notes: string | null
  staff: { id: string; firstName: string; lastName: string | null; fullName: string } | null
  academicYear: { id: string; name: string; isCurrent: boolean } | null
  class: { id: string; name: string } | null
  section: { id: string; name: string } | null
  subject: { id: string; name: string; code: string | null } | null
}

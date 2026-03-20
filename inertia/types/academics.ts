export type SchoolClass = {
  id: string
  name: string
  code: string | null
  displayOrder: number
  description: string | null
  createdAt: string
  updatedAt: string | null
  sections?: Section[]
  meta?: {
    pivot_periods_per_week?: number
    pivot_is_mandatory?: boolean
    pivot_subject_id?: string
    pivot_class_id?: string
    pivot_created_at?: string
    pivot_updated_at?: string
  }
}

export type Section = {
  id: string
  classId: string
  name: string
  capacity: number
  roomNumber: string | null
  createdAt: string
  updatedAt: string | null
  class?: SchoolClass
}

export type Subject = {
  id: string
  name: string
  code: string | null
  description: string | null
  isElective: boolean
  createdAt: string
  updatedAt: string | null
  classes?: SchoolClass[]
  meta?: Record<string, unknown>
}

export type ClassWithSections = {
  id: string
  name: string
  sections: Section[]
}

export type AcademicYear = {
  id: string
  name: string
  startDate: string
  endDate: string
  isCurrent: boolean
  createdAt: string
  updatedAt: string | null
}

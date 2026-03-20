import Enrollment from '#models/enrollment'

export default class EnrollmentDto {
  declare id: string
  declare schoolId: string
  declare studentId: string
  declare academicYearId: string
  declare classId: string
  declare sectionId: string | null
  declare rollNumber: string | null
  declare enrollmentDate: string
  declare createdAt: string
  declare updatedAt: string | null

  // Related data
  declare academicYear?: {
    id: string
    name: string
    startDate: string
    endDate: string
    isCurrent: boolean
  }
  declare class?: {
    id: string
    name: string
    displayOrder: number
  }
  declare section?: {
    id: string
    name: string
    capacity: number | null
  } | null

  constructor(enrollment?: Enrollment) {
    if (!enrollment) return

    this.id = enrollment.id
    this.schoolId = enrollment.schoolId
    this.studentId = enrollment.studentId
    this.academicYearId = enrollment.academicYearId
    this.classId = enrollment.classId
    this.sectionId = enrollment.sectionId
    this.rollNumber = enrollment.rollNumber
    this.enrollmentDate = enrollment.enrollmentDate.toISODate()!
    this.createdAt = enrollment.createdAt.toISO()!
    this.updatedAt = enrollment.updatedAt?.toISO() ?? null

    // Include related data if loaded
    if (enrollment.academicYear) {
      this.academicYear = {
        id: enrollment.academicYear.id,
        name: enrollment.academicYear.name,
        startDate: enrollment.academicYear.startDate.toISODate()!,
        endDate: enrollment.academicYear.endDate.toISODate()!,
        isCurrent: enrollment.academicYear.isCurrent,
      }
    }

    if (enrollment.class) {
      this.class = {
        id: enrollment.class.id,
        name: enrollment.class.name,
        displayOrder: enrollment.class.displayOrder,
      }
    }

    if (enrollment.section) {
      this.section = {
        id: enrollment.section.id,
        name: enrollment.section.name,
        capacity: enrollment.section.capacity,
      }
    }
  }
}

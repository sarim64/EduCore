import { BaseModelDto } from '@adocasts.com/dto/base'
import TeacherAssignment from '#models/teacher_assignment'
import StaffMemberDto from '#dtos/staff_member'
import AcademicYearDto from '#dtos/academic_year'
import SchoolClassDto from '#dtos/school_class'
import SectionDto from '#dtos/section'
import SubjectDto from '#dtos/subject'

export default class TeacherAssignmentDto extends BaseModelDto {
  declare id: string
  declare staffMemberId: string
  declare academicYearId: string
  declare classId: string
  declare sectionId: string | null
  declare subjectId: string
  declare isClassTeacher: boolean
  declare notes: string | null
  declare createdAt: string
  declare updatedAt: string | null
  declare staffMember: StaffMemberDto | null
  declare academicYear: AcademicYearDto | null
  declare class: SchoolClassDto | null
  declare section: SectionDto | null
  declare subject: SubjectDto | null

  constructor(assignment?: TeacherAssignment) {
    super()

    if (!assignment) return
    this.id = assignment.id
    this.staffMemberId = assignment.staffMemberId
    this.academicYearId = assignment.academicYearId
    this.classId = assignment.classId
    this.sectionId = assignment.sectionId
    this.subjectId = assignment.subjectId
    this.isClassTeacher = assignment.isClassTeacher
    this.notes = assignment.notes
    this.createdAt = assignment.createdAt.toISO()!
    this.updatedAt = assignment.updatedAt?.toISO() ?? null
    this.staffMember = assignment.staffMember ? new StaffMemberDto(assignment.staffMember) : null
    this.academicYear = assignment.academicYear
      ? new AcademicYearDto(assignment.academicYear)
      : null
    this.class = assignment.class ? new SchoolClassDto(assignment.class) : null
    this.section = assignment.section ? new SectionDto(assignment.section) : null
    this.subject = assignment.subject ? new SubjectDto(assignment.subject) : null
  }
}

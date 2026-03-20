import { BaseModelDto } from '@adocasts.com/dto/base'
import StaffQualification from '#models/staff_qualification'

export default class StaffQualificationDto extends BaseModelDto {
  declare id: string
  declare staffMemberId: string
  declare degree: string
  declare fieldOfStudy: string | null
  declare institution: string
  declare year: number
  declare grade: string | null
  declare certificateUrl: string | null
  declare createdAt: string
  declare updatedAt: string | null

  constructor(qualification?: StaffQualification) {
    super()

    if (!qualification) return
    this.id = qualification.id
    this.staffMemberId = qualification.staffMemberId
    this.degree = qualification.degree
    this.fieldOfStudy = qualification.fieldOfStudy
    this.institution = qualification.institution
    this.year = qualification.year
    this.grade = qualification.grade
    this.certificateUrl = qualification.certificateUrl
    this.createdAt = qualification.createdAt.toISO()!
    this.updatedAt = qualification.updatedAt?.toISO() ?? null
  }
}

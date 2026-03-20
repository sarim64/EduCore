import { BaseModelDto } from '@adocasts.com/dto/base'
import AcademicYear from '#models/academic_year'

export default class AcademicYearDto extends BaseModelDto {
  declare id: string
  declare name: string
  declare startDate: string
  declare endDate: string
  declare isCurrent: boolean
  declare createdAt: string
  declare updatedAt: string | null

  constructor(academicYear?: AcademicYear) {
    super()

    if (!academicYear) return
    this.id = academicYear.id
    this.name = academicYear.name
    this.startDate = academicYear.startDate.toISODate()!
    this.endDate = academicYear.endDate.toISODate()!
    this.isCurrent = academicYear.isCurrent
    this.createdAt = academicYear.createdAt.toISO()!
    this.updatedAt = academicYear.updatedAt?.toISO() ?? null
  }
}

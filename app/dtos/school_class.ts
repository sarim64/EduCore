import { BaseModelDto } from '@adocasts.com/dto/base'
import SchoolClass from '#models/school_class'

export default class SchoolClassDto extends BaseModelDto {
  declare id: string
  declare name: string
  declare code: string | null
  declare displayOrder: number
  declare description: string | null
  declare createdAt: string
  declare updatedAt: string | null

  constructor(schoolClass?: SchoolClass) {
    super()

    if (!schoolClass) return
    this.id = schoolClass.id
    this.name = schoolClass.name
    this.code = schoolClass.code
    this.displayOrder = schoolClass.displayOrder
    this.description = schoolClass.description
    this.createdAt = schoolClass.createdAt.toISO()!
    this.updatedAt = schoolClass.updatedAt?.toISO() ?? null
  }
}
